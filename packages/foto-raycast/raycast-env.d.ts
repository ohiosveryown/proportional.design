/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** API Base URL - Base URL of the Foto app */
  "apiBaseUrl": string,
  /** Shared Secret - Bearer token. Must match GALLERY_SECRET on the server. */
  "sharedSecret": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `upload-photo` command */
  export type UploadPhoto = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `upload-photo` command */
  export type UploadPhoto = {}
}

