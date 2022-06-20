import { createAction } from "@reduxjs/toolkit";
import { CElement, CElementToCreate, CElementTransformation } from "./celement";
import { CElementLayoutAlignUpdate } from "./celement-layout";

export const celementCreateAction = createAction<{ cel: CElementToCreate, toParentCelId?: string }>(
  "celement/create"
);

export const celementAddedAction = createAction<{ cel: CElement, toParentCelId?: string }>(
  "celement/added"
);

export const celementRemoveAction = createAction<{ celId: string, withChildren: boolean }>(
  "celement/remove"
);

export const celementSelectAction = createAction<{ celId: string | undefined }>(
  "celement/select"
);

/** Change position (x,y) of cel quiet
 * ! Quiet -> no @see lastCElementTransformed will be set */
export const celementChangePositionQuietAction = createAction<{
  celId: string;
  position: { x: number; y: number };
}>("celement/changePosition");

/** Set cel trasformation (width, height, margins, paddings, align) */
export const celementTransformAction = createAction<{
  celId: string;
  transformation: CElementTransformation;
}>("celement/trasform");

/** Set cel layout align */
export const celementSetLayoutAlignAction = createAction<{
  celId: string;
  layoutAlign: CElementLayoutAlignUpdate;
}>("celement/setLayoutPosition");
