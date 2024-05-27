# Content Hub integration with Toast UI Image Editor and MUI

Toast UI is an image editor with an MIT license. It loads an image to a canvas and allows downloading or exporting a modified image as a base64 string. The string is later converted to `ArrayBufferUploadSource` via the `base64-arraybuffer` package and uploaded as a new asset with Content Hub's `uploadsClient`.
MUI is a front-end library that provides react components in material style. Content Hub uses it internally, so it can add visual consistency to your external components.

 - [Toast UI Editor Main Repository](https://github.com/nhn/tui.image-editor?tab=readme-ov-file)
 - [Toast UI Editor React Wrapper](https://github.com/nhn/tui.image-editor/tree/master/apps/react-image-editor)
 - [MUI](https://mui.com/)

## Starter

The external component is based on the following [Content Hub External Components Starter](https://github.com/nvadera-sc/content-hub-external-components-starter)

## Config

Component config example:

```json
{
  "editorConfig": {
    "includeUI": {
      "theme": {
        "header.display": "none"
      },
      "menu": ["crop", "flip", "rotate", "draw", "shape", "icon", "text", "filter"],
      "initMenu": "filter",
      "uiSize": {
        "width": "100%",
        "height": "800px"
      },
      "menuBarPosition": "right"
    },
    "cssMaxHeight": 700,
    "cssMaxWidth": 1000,
    "selectionStyle": {
      "cornerSize": 20,
      "rotatingPointOffset": 70
    }
  }
}
```