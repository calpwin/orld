import { createSelector } from "@reduxjs/toolkit";
import { editorInitialState } from "../editor.state";

export const lastEditorMouseMoveSelector = createSelector(
  (state: typeof editorInitialState) => state.lastEditorMouseMove,
  (x) => x
);

export const lastEditorMediaSelector = createSelector(
  (state: typeof editorInitialState) => state.editorMedia,
  (x) => x
);
