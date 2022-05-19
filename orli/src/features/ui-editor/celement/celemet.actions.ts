import { createAction } from "@reduxjs/toolkit";
import { CElement } from "./celement";
import { LayoutAlign, LayoutDisplayMode } from "./celement-layout";

export const celementAddAction = createAction<{ cel: CElement }>(
  "celement/add"
);
export const celementSelectAction = createAction<{ celId: string }>(
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
    vertical?: LayoutAlign;
    horizontal?: LayoutAlign;
  };
}>("celement/setLayoutPosition");
