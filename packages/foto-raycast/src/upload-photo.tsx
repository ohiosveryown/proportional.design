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

type UploadOk = { ok: true; slug?: string; filename: string };
type UploadFail = {
  ok: false;
  error: string;
  filename: string;
  unauthorized?: boolean;
};
type UploadOutcome = UploadOk | UploadFail;

async function uploadOne(
  filePath: string,
  caption: string,
  tags: string,
  destination: Destination,
  storyId: string,
  storyName: string,
  prefs: Prefs,
): Promise<UploadOutcome> {
  const filename = basename(filePath);
  const mime = mimeFor(filePath);
  if (!mime) {
    return {
      ok: false,
      filename,
      error: "Unsupported type — use .jpg, .png, .gif, .webp, or .heic",
    };
  }

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
      return {
        ok: false,
        filename,
        unauthorized: true,
        error: "Unauthorized — check Shared Secret in preferences",
      };
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        filename,
        error: text || `HTTP ${res.status} ${res.statusText}`,
      };
    }

    const json = (await res.json()) as UploadResult;
    if (!json.success) {
      return { ok: false, filename, error: json.error || "Unknown error" };
    }

    return { ok: true, filename, slug: json.slug };
  } catch (err) {
    return {
      ok: false,
      filename,
      error:
        err instanceof Error
          ? err.message
          : `Couldn't reach Foto at ${prefs.apiBaseUrl}`,
    };
  }
}

function destinationLabel(destination: Destination): string {
  if (destination === "story") return "Stories";
  if (destination === "both") return "Gallery + Stories";
  return "Foto";
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
  const multi = files.length > 1;

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      try {
        const items = await getSelectedFinderItems();
        const images = items
          .map((item) => item.path)
          .filter((path) => mimeFor(path));
        if (images.length) setFiles(images);
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
                c.id ? c : { name: c.name || "New Story…", id: "" },
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
            title={multi ? `Upload ${files.length} Photos` : "Upload Photo"}
            onSubmit={async (values: {
              files: string[];
              destination: Destination;
              storyKey: string;
              newStoryName: string;
              caption: string;
              tags: string;
            }) => {
              const paths = (
                values.files?.length ? values.files : files
              ).filter((path) => mimeFor(path));
              if (!paths.length) {
                await showToast({
                  style: Toast.Style.Failure,
                  title: "Pick at least one image",
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

              const storyId = isNew ? "" : (choice?.id ?? "");
              const storyName = isNew ? newName : (choice?.name ?? "");
              const caption = values.caption ?? "";
              const tags = values.tags ?? "";
              const total = paths.length;
              const toast = await showToast({
                style: Toast.Style.Animated,
                title: total === 1 ? "Uploading…" : `Uploading 1 of ${total}…`,
                message: caption.trim() || basename(paths[0]),
              });

              let okCount = 0;
              let lastSlug: string | undefined;
              const failures: UploadFail[] = [];

              for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                toast.title =
                  total === 1
                    ? "Uploading…"
                    : `Uploading ${i + 1} of ${total}…`;
                toast.message = caption.trim() || basename(path);

                const result = await uploadOne(
                  path,
                  caption,
                  tags,
                  dest,
                  storyId,
                  storyName,
                  prefs,
                );

                if (result.ok) {
                  okCount++;
                  lastSlug = result.slug ?? lastSlug;
                } else {
                  failures.push(result);
                  if (result.unauthorized) {
                    toast.style = Toast.Style.Failure;
                    toast.title = "Unauthorized";
                    toast.message =
                      "Check the Shared Secret in extension preferences.";
                    toast.primaryAction = {
                      title: "Open Preferences",
                      onAction: () => openExtensionPreferences(),
                    };
                    return;
                  }
                }
              }

              const base = prefs.apiBaseUrl.replace(/\/$/, "");

              if (okCount === 0) {
                toast.style = Toast.Style.Failure;
                toast.title =
                  total === 1 ? "Upload failed" : "All uploads failed";
                toast.message = failures[0]?.error ?? "Unknown error";
                return;
              }

              toast.style = Toast.Style.Success;
              if (total === 1) {
                toast.title = `Uploaded to ${destinationLabel(dest)}`;
                toast.message = caption.trim() || basename(paths[0]);
              } else if (failures.length === 0) {
                toast.title = `Uploaded ${okCount} to ${destinationLabel(dest)}`;
                toast.message = caption.trim() || undefined;
              } else {
                toast.title = `Uploaded ${okCount} of ${total}`;
                toast.message = `${failures.length} failed — ${failures[0].filename}`;
              }

              if (okCount === 1 && lastSlug) {
                toast.primaryAction = {
                  title: "Open Photo",
                  onAction: () => open(`${base}/photo/${lastSlug}`),
                };
              } else {
                toast.primaryAction = {
                  title: "Open Gallery",
                  onAction: () => open(base),
                };
              }

              await popToRoot();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="files"
        title={multi ? "Images" : "Image"}
        allowMultipleSelection={true}
        canChooseDirectories={false}
        value={files}
        onChange={setFiles}
        info="Select multiple images to upload in one go. Caption, tags, and destination apply to all."
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
        info={
          multi
            ? "Applied to every selected image. Leave blank to skip."
            : undefined
        }
      />
      {destination !== "story" && (
        <Form.TextField
          id="tags"
          title="Tags"
          placeholder="cabinet, cherry"
          info={
            multi
              ? "Applied to every selected image. Auto-tagging may add more."
              : "Optional. Auto-tagging may add more from existing gallery tags."
          }
        />
      )}
    </Form>
  );
}
