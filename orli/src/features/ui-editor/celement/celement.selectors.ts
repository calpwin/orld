import { createSelector } from "@reduxjs/toolkit";
import { editorInitialState } from "../editor.state";

export const currentSelectedCelementSelector = createSelector(
  (state: typeof editorInitialState) => state.currentSelectedCElementId,
  (x) => x
);

export const lastCElementChangedSelector = createSelector(
  (state: typeof editorInitialState) => state.lastCElementChanged,
  (x) => x
);
