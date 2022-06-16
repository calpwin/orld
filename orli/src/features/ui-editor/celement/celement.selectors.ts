import { createSelector } from "@reduxjs/toolkit";
import { editorInitialState } from "../editor.state";

export const lastCelementCreateSelector = createSelector(
  (state: typeof editorInitialState) => state.lastCElementCreate,
  (x) => x
);

export const lastCelementRemovedSelector = createSelector(
  (state: typeof editorInitialState) => state.lastCElementRemoved,
  (x) => x
);

export const currentSelectedCelementSelector = createSelector(
  (state: typeof editorInitialState) => state.currentSelectedCElementId,
  (x) => x
);

export const lastCElementChangedSelector = createSelector(
  (state: typeof editorInitialState) => state.lastCElementChanged,
  (x) => x
);

export const lastCElementTransformedSelector = createSelector(  
  (state: typeof editorInitialState) => state.lastCElementTransformed,
  (x) => x
);
