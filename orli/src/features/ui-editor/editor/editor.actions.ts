import { createAction } from "@reduxjs/toolkit";
import { EditorMediaType } from "./editor-media-type";

export const editorMouseMoveAction = createAction<{x: number, y: number}>('editor/mouseMove');

export const editorChangeMediaAction = createAction<{media: EditorMediaType}>('editor/changeMedia');