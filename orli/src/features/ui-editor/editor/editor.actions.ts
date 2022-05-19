import { createAction } from "@reduxjs/toolkit";

export const editorMouseMoveAction = createAction<{x: number, y: number}>('editor/mouseMove');