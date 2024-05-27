import React from "react";
import { Stack, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

export const ImageEditorCustomPanel = ({ isOpen, onOpen, onClose, onSave }) => {
  return (
    <Stack direction="row" spacing={2}>
      {!isOpen && (
        <Button onClick={onOpen} startIcon={<EditIcon />} variant="contained">
          Open in editor
        </Button>
      )}
      {isOpen && (
        <Button
          onClick={onSave}
          startIcon={<SaveIcon />}
          variant="contained"
          color="success"
        >
          Save
        </Button>
      )}
      {isOpen && (
        <Button onClick={onClose} startIcon={<CloseIcon />} color="secondary">
          Close
        </Button>
      )}
    </Stack>
  );
};
