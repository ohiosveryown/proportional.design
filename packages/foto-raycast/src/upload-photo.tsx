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
  const ran = useRef(false);

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
      setPhase("form");
    })();
  }, []);

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
              await uploadPhoto(
                filePath,
                values.caption ?? "",
                values.tags ?? "",
                values.destination ?? "gallery",
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
      <Form.Dropdown id="destination" title="Destination" defaultValue="gallery">
        <Form.Dropdown.Item value="gallery" title="Gallery" />
        <Form.Dropdown.Item value="story" title="Story" />
        <Form.Dropdown.Item value="both" title="Both" />
      </Form.Dropdown>
      <Form.TextField
        id="caption"
        title="Caption"
        placeholder="Hemlock Sideboard WIP"
      />
      <Form.TextField
        id="tags"
        title="Tags"
        placeholder="cabinet, cherry"
        info="Optional. Gallery/Both only — auto-tagging may add more from existing tags. Stories skip auto-tag."
      />
    </Form>
  );
}
