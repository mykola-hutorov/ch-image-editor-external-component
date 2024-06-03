import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import ImageEditor from "./ImageEditor";
import { ContentHubClient } from "@sitecore/sc-contenthub-webclient-sdk/dist/clients/content-hub-client";
import OAuthPasswordGrant from "@sitecore/sc-contenthub-webclient-sdk/dist/authentication/oauth-password-grant";

export default function createExternalRoot(container) {
  return {
    async render(context) {
      const { entity, api, config } = context;
      const { notifier } = api;

      if (!entity || !api || !config || !notifier) {
        notifier.notifyError("Something is missing!");
        return;
      }

      const defaultExtensions = ["png"];
      const {
        editorConfig,
        supportedFileExtensions = defaultExtensions,
        modifiedFileExtensions = defaultExtensions,
      } = config;

      const oauth = new OAuthPasswordGrant(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.CHUSERNAME,
        process.env.CHPASSWORD
      );
      const client = new ContentHubClient(process.env.ENDPOINT, oauth);
      const isAuthenticated = await client.internalClient.authenticateAsync();

      if (!isAuthenticated) {
        notifier.notifyError("Not authenticated!");
        return;
      }

      const { renditions, properties } = entity;
      const imageUrl = renditions?.downloadOriginal[0];

      if (!imageUrl) {
        notifier.notifyError("ImageUrl or config is missing!");
        return;
      }

      const extensionRegex = /\.[^/.]+$/;
      const { Title, FileName, FileProperties } = properties ?? {};
      const assetTitle = Title?.Invariant ?? "image";
      const fileName =
        FileName?.Invariant?.replace(extensionRegex, "") ?? "image";
      const fileExt = FileProperties?.Invariant?.properties?.extension;

      if (fileExt && !supportedFileExtensions.includes(fileExt)) {
        notifier.notifyError("File is not supported!");
        return;
      }

      const root = createRoot(container);
      root.render(
        <ImageEditor
          client={client}
          notifier={notifier}
          editorConfig={editorConfig}
          modifiedFileExtensions={modifiedFileExtensions}
          imageUrl={imageUrl}
          currentAssetTitle={assetTitle}
          currentFileName={fileName}
        />
      );
    },
    unmount() {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
}
