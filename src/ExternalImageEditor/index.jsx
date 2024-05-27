import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import ImageEditor from "./ImageEditor";

export default function createExternalRoot(container) {
  return {
    async render(context) {
      console.info(context);
      const { entity, client, api, config } = context;

      if (!entity || !client) {
        return;
      }

      const renditionUrl = entity?.renditions?.downloadOriginal[0];

      const root = createRoot(container);
      root.render(
        <ImageEditor
          config={config}
          imageUrl={renditionUrl}
          uploadsClient={client.uploads}
          entitiesClient={client.entitiesClient}
          notifier={api.notifier}
        />
      );
    },
    unmount() {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
}
