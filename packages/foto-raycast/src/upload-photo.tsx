import {
  Action,
  ActionPanel,
  Form,
  Toast,
  getPreferenceValues,
  getSelectedFinderItems,
  open,
  openExtensionPreferences,
  popToRoot,
  showToast,
} from "@raycast/api";
import { useEffect, useRef, useState } from "react";
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

type Prefs = {
  apiBaseUrl: string;
  sharedSecret: string;
};

type UploadResult = {
  success: boolean;
  slug?: string;
  error?: string;
};

type StoryChoice = { name: string; id: string };

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".heic": "image/heic",
  ".heif": "image/heif",
};

function mimeFor(filePath: string): string | null {
  return MIME_BY_EXT[extname(filePath).toLowerCase()] ?? null;
}

type Destination = "gallery" | "story" | "both";

async function uploadPhoto(
  filePath: string,
  caption: string,
  tags: string,
  destination: Destination,
  storyId: string,
  storyName: string,
  prefs: Prefs,
): Promise<void> {
  const mime = mimeFor(filePath);
  if (!mime) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Unsupported file type",
      message: "Pick a .jpg, .png, .gif, .webp, or .heic",
    });
    return;
  }

  const filename = basename(filePath);
  const toast = await showToast({
    style: Toast.Style.Animated,
    title: "Uploading…",
    message: caption.trim() || filename,
  });

  try {
    const buffer = await readFile(filePath);
    const base = prefs.apiBaseUrl.replace(/\/$/, "");
    const params = new URLSearchParams({ filename, destination });
    if (caption.trim()) params.set("caption", caption.trim());
    if (tags.trim()) params.set("tags", tags.trim());
    if (destination !== "gallery") {
      if (storyId.trim()) params.set("storyId", storyId.trim());
      if (storyName.trim()) params.set("storyName", storyName.trim());
    }

    const res = await fetch(`${base}/api/upload-photo?${params}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${prefs.sharedSecret}`,
        "Content-Type": mime,
      },
      body: buffer,
    });

    if (res.status === 401) {
      toast.style = Toast.Style.Failure;
      toast.title = "Unauthorized";
      toast.message = "Check the Shared Secret in extension preferences.";
      toast.primaryAction = {
        title: "Open Preferences",
        onAction: () => openExtensionPreferences(),
      };
      return;
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      toast.style = Toast.Style.Failure;
      toast.title = `Upload failed (${res.status})`;
      toast.message = text || res.statusText;
      return;
    }

    const json = (await res.json()) as UploadResult;
    if (!json.success) {
      toast.style = Toast.Style.Failure;
      toast.title = "Upload failed";
      toast.message = json.error || "Unknown error";
      return;
    }

    toast.style = Toast.Style.Success;
    toast.title =
      destination === "story"
        ? "Uploaded to Stories"
        : destination === "both"
          ? "Uploaded to Gallery + Stories"
          : "Uploaded to Foto";
    toast.message = caption.trim() || filename;

    if (json.slug) {
      const url = `${base}/photo/${json.slug}`;
      toast.primaryAction = {
        title: "Open Photo",
        onAction: () => open(url),
      };
    } else {
      toast.primaryAction = {
        title: "Open Gallery",
        onAction: () => open(base),
      };
    }
  } catch (err) {
    toast.style = Toast.Style.Failure;
    toast.title = "Couldn't reach Foto";
    toast.message =
      err instanceof Error
        ? err.message
        : `Is it running at ${prefs.apiBaseUrl}?`;
  }
}

export default function UploadPhoto() {
  const prefs = getPreferenceValues<Prefs>();
  const [phase, setPhase] = useState<"checking" | "form">("checking");
  const [files, setFiles] = useState<string[]>([]);
  const [destination, setDestination] = useState<Destination>("gallery");
  const [storyChoices, setStoryChoices] = useState<StoryChoice[]>([
    { name: "New Story…", id: "" },
  ]);
  const [storyKey, setStoryKey] = useState("__new__");
  const ran = useRef(false);

  const needsStory = destination === "story" || destination === "both";
  const creatingNewStory = needsStory && storyKey === "__new__";

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      try {
        const items = await getSelectedFinderItems();
        const imageItem = items.find((item) => mimeFor(item.path));
        if (imageItem) setFiles([imageItem.path]);
      } catch {
        // Finder isn't frontmost or has no selection — show empty picker.
      }

      try {
        const base = prefs.apiBaseUrl.replace(/\/$/, "");
        const res = await fetch(`${base}/api/stories/choices`);
        if (res.ok) {
          const json = (await res.json()) as {
            choices?: StoryChoice[];
          };
          if (json.choices?.length) {
            setStoryChoices(
              json.choices.map((c) =>
                c.id
                  ? c
                  : { name: c.name || "New Story…", id: "" },
              ),
            );
          }
        }
      } catch {
        // Offline / cold start — keep New Story only.
      }

      setPhase("form");
    })();
  }, [prefs.apiBaseUrl]);

  if (phase === "checking") {
    return <Form isLoading />;
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Upload Photo"
            onSubmit={async (values: {
              files: string[];
              destination: Destination;
              storyKey: string;
              newStoryName: string;
              caption: string;
              tags: string;
            }) => {
              const filePath = values.files?.[0] ?? files[0];
              if (!filePath) {
                await showToast({
                  style: Toast.Style.Failure,
                  title: "Pick an image first",
                });
                return;
              }

              const dest = values.destination ?? destination;
              const key = values.storyKey ?? storyKey;
              const choice = storyChoices.find(
                (c) => (c.id || "__new__") === key,
              );
              const isNew = !choice?.id;
              const newName = (values.newStoryName ?? "").trim();

              if ((dest === "story" || dest === "both") && isNew && !newName) {
                await showToast({
                  style: Toast.Style.Failure,
                  title: "Name the new story",
                  message: "Enter a story name, or pick an existing one.",
                });
                return;
              }

              await uploadPhoto(
                filePath,
                values.caption ?? "",
                values.tags ?? "",
                dest,
                isNew ? "" : choice?.id ?? "",
                isNew ? newName : choice?.name ?? "",
                prefs,
              );
              await popToRoot();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="files"
        title="Image"
        allowMultipleSelection={false}
        canChooseDirectories={false}
        value={files}
        onChange={setFiles}
      />
      <Form.Dropdown
        id="destination"
        title="Destination"
        value={destination}
        onChange={(v) => setDestination(v as Destination)}
      >
        <Form.Dropdown.Item value="gallery" title="Gallery" />
        <Form.Dropdown.Item value="story" title="Story" />
        <Form.Dropdown.Item value="both" title="Both" />
      </Form.Dropdown>
      {needsStory && (
        <Form.Dropdown
          id="storyKey"
          title="Story"
          value={storyKey}
          onChange={setStoryKey}
        >
          {storyChoices.map((c) => {
            const value = c.id || "__new__";
            return (
              <Form.Dropdown.Item key={value} value={value} title={c.name} />
            );
          })}
        </Form.Dropdown>
      )}
      {creatingNewStory && (
        <Form.TextField
          id="newStoryName"
          title="New story name"
          placeholder="Shop WIP"
        />
      )}
      <Form.TextField
        id="caption"
        title="Caption"
        placeholder="Hemlock Sideboard WIP"
      />
      {destination !== "story" && (
        <Form.TextField
          id="tags"
          title="Tags"
          placeholder="cabinet, cherry"
          info="Optional. Auto-tagging may add more from existing gallery tags."
        />
      )}
    </Form>
  );
}
