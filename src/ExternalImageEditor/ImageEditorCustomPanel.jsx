import React from "react";
import { Stack, Button, TextField, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

export const ImageEditorCustomPanel = ({
  isOpen,
  onOpen,
  onClose,
  onSave,
  onAssetTitleChange,
  onFileNameChange,
  onFileExtensionChange,
  assetTitle,
  fileName,
  modifiedFileExtensions,
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {!isOpen && (
        <Button onClick={onOpen} startIcon={<EditIcon />} variant="contained">
          Open in editor
        </Button>
      )}
      {isOpen && (
        <>
          <Button
            onClick={onSave}
            startIcon={<SaveIcon />}
            variant="contained"
            color="success"
          >
            Save
          </Button>
          <Button onClick={onClose} startIcon={<CloseIcon />} color="secondary">
            Close
          </Button>
          <TextField
            required
            id="asset-title"
            label="Asset Title"
            variant="outlined"
            defaultValue={assetTitle}
            onChange={onAssetTitleChange}
          />
          <TextField
            required
            id="file-name"
            label="File Name"
            variant="outlined"
            defaultValue={fileName}
            onChange={onFileNameChange}
          />
          <TextField
            select
            id="file-extension"
            label="File Ext"
            defaultValue={modifiedFileExtensions[0]}
            onChange={onFileExtensionChange}
          >
            {modifiedFileExtensions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}
    </Stack>
  );
};
