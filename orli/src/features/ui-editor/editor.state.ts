import { createReducer } from "@reduxjs/toolkit";
import {
  CElement,
  CElementToCreate,
  CElementTransformation,
} from "./celement/celement";
import { celementReducerMapBuilder } from "./celement/celement.reducers";
import { editorReducerMapBuilder } from "./editor/editor.reducers";

export type CElementHash = { [id: string]: CElement };

export const editorInitialState = {
  celements: <{ [id: string]: CElement }>{},
  currentSelectedCElementId: <string | undefined>undefined,

  lastCElementCreate: <
    | {
        cel: CElementToCreate;
        toParentCelId?: string;
      }
    | undefined
  >undefined,
  lastCElementRemoved: <CElement | undefined>undefined,

  lastEditorMouseMove: { x: 0, y: 0 },
  lastCElementChanged: <CElement | undefined>undefined,
  lastCElementTransformed: <
    { celId: string; transformation: CElementTransformation } | undefined
  >undefined,
};

export const editorReducer = createReducer(editorInitialState, (builder) => {
  celementReducerMapBuilder(builder);
  editorReducerMapBuilder(builder);
});
