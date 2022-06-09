import { createAction } from "@reduxjs/toolkit";
import { CElement } from "./celement";
import { FlexDirection, LayoutAlign, LayoutDisplayMode } from "./celement-layout";

export const celementAddAction = createAction<{ cel: CElement }>(
  "celement/add"
);
export const celementSelectAction = createAction<{ celId: string | undefined }>(
  "celement/select"
);

export const celementChangePositionAction = createAction<{
  celId: string;
  position: { x: number; y: number };
}>("celement/changePosition");

export const celementSetLayoutAlignAction = createAction<{
  celId: string;
  layoutAlign: {
    displayMode?: LayoutDisplayMode,
    flexDirection?: FlexDirection,
    vertical?: LayoutAlign;
    horizontal?: LayoutAlign;
  };
}>("celement/setLayoutPosition");
