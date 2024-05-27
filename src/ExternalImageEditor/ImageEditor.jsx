import React, { useRef, useState, useEffect, useCallback } from "react";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import { UploadRequest } from "@sitecore/sc-contenthub-webclient-sdk/dist/models/upload/upload-request";
import { ArrayBufferUploadSource } from "@sitecore/sc-contenthub-webclient-sdk/dist/models/upload/array-buffer-upload-source";
import { Paper, Stack } from "@mui/material";
import { decode } from "base64-arraybuffer";
import { ImageEditorCustomPanel } from "./ImageEditorCustomPanel";

const Editor = ({ config, imageUrl, uploadsClient, entitiesClient, notifier }) => {
  const [imageObject, setImageObject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageEditorInstance, setImageEditorInstance] = useState(null);
  const editorRef = useRef();

  if (!imageUrl && config && config.editorConfig) {
    return;
  }

  useEffect(() => {
    if (isOpen && editorRef.current) {
      const instance = editorRef?.current?.getInstance();
      setImageEditorInstance(instance);

      instance.loadImageFromURL(imageUrl, "image").then(() => {
        instance.ui.activeMenuEvent();
        notifier.notifySuccess("Image is successfully loaded.");
      });
    } else if (!isOpen) {
      setImageEditorInstance(null);
    }
  }, [isOpen, imageUrl]);

  useEffect(() => {
    const createAsset = async () => {
      if (!imageObject) {
        return;
      }

      let pureBase64 = imageObject.imageBase64?.split(",")[1];
      const uploadSource = new ArrayBufferUploadSource(
        decode(pureBase64),
        imageObject.fullName
      );
      const request = new UploadRequest(
        uploadSource,
        "AssetUploadConfiguration",
        "NewAsset"
      );
      uploadsClient
        .uploadAsync(request)
        .then((data) => {
          notifier.notifySuccess("Image successfully saved.");
          console.info(data);
        })
        .catch((err) => {
          notifier.notifyError(`Image upload error!`);
          console.error(err);
        });
    };

    createAsset();
  }, [imageObject, uploadsClient]);

  const onSave = useCallback(() => {
    if (imageEditorInstance) {
      const image = imageEditorInstance.toDataURL();
      const name = `${imageEditorInstance.getImageName()}-${
        Math.floor(Math.random() * 90000) + 10000
      }.png`;
      setImageObject({
        imageBase64: image,
        fullName: name,
      });
      notifier.notifyInfo(`Saving file as ${name}...`);
    } else {
      notifier.notifyWarning("Image Editor Instance is empty!");
    }
  }, [imageEditorInstance]);

  return (
    <Stack direction="column" spacing={2}>
      <ImageEditorCustomPanel
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        onSave={onSave}
      />

      {isOpen && (
        <Paper elevation={1} square={false}>
          <ImageEditor ref={editorRef} {...config.editorConfig} />
        </Paper>
      )}
    </Stack>
  );
};

export default Editor;
