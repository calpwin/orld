import { createAction } from "@reduxjs/toolkit";
import { CElement, CElementTransformation } from "./celement";
import { CElementLayoutAlignUpdate, FlexDirection, LayoutAlign, LayoutDisplayMode } from "./celement-layout";

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

export const celementTransformAction = createAction<{
  celId: string;
  transformation: CElementTransformation;
}>("celement/trasform");

export const celementSetLayoutAlignAction = createAction<{
  celId: string;
  layoutAlign: CElementLayoutAlignUpdate;
}>("celement/setLayoutPosition");
