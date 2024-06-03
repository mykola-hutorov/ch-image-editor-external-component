import React, { useRef, useState, useEffect, useCallback } from "react";
import { Stack } from "@mui/material";
import ImageEditor from "@toast-ui/react-image-editor";
import { ImageEditorCustomPanel } from "./ImageEditorCustomPanel";
import { loadImage, createAsset } from "./helpers";
import "tui-image-editor/dist/tui-image-editor.css";

const Editor = ({
  client,
  notifier,
  editorConfig,
  modifiedFileExtensions,
  imageUrl,
  currentAssetTitle,
  currentFileName,
}) => {
  const editorRef = useRef();

  const [imageObject, setImageObject] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [imageEditorInstance, setImageEditorInstance] = useState();

  const [assetTitle, setAssetTitle] = useState(currentAssetTitle);
  const [fileName, setFileName] = useState(currentFileName);
  const [fileExtension, setFileExtension] = useState(modifiedFileExtensions[0]);

  useEffect(() => {
    if (isOpen && editorRef.current && fileName) {
      const instance = editorRef?.current?.getInstance();
      setImageEditorInstance(instance);
      loadImage(notifier, instance, imageUrl, fileName);
    } else if (!isOpen) {
      setImageEditorInstance(null);
    }
  }, [isOpen, imageUrl]);

  useEffect(() => {
    createAsset(notifier, client, imageObject, assetTitle);
  }, [imageObject, client]);

  const onSave = useCallback(() => {
    if (!imageEditorInstance) {
      notifier.notifyWarning("Image Editor Instance is empty!");
      return;
    }

    const image = imageEditorInstance.toDataURL();
    const name = `${fileName}.${fileExtension}`;
    setImageObject({
      imageBase64: image,
      fullName: name,
    });
    notifier.notifyInfo(`Saving file as ${name}...`);
  }, [imageEditorInstance, fileName, fileExtension]);

  return (
    <Stack direction="column" spacing={2}>
      <ImageEditorCustomPanel
        assetTitle={assetTitle}
        fileName={fileName}
        modifiedFileExtensions={modifiedFileExtensions}
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        onSave={onSave}
        onAssetTitleChange={(e) => setAssetTitle(e.target.value)}
        onFileNameChange={(e) => setFileName(e.target.value)}
        onFileExtensionChange={(e) => setFileExtension(e.target.value)}
      />

      {isOpen && <ImageEditor ref={editorRef} {...editorConfig} />}
    </Stack>
  );
};

export default Editor;
