import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { HashHelpers } from "../../../helpers/hash.helper";
import { CElementHash, editorInitialState } from "../editor.state";
import { CElement } from "./celement";
import {
  celementAddAction,
  celementChangePositionAction,
  celementSelectAction,
  celementSetLayoutAlignAction,
} from "./celemet.actions";

export const celementReducerMapBuilder = (
  builder: ActionReducerMapBuilder<typeof editorInitialState>
) => {
  builder.addCase(celementSelectAction, (state, action) => {
    state.currentSelectedCElementId = action.payload.celId;
  });

  builder.addCase(celementAddAction, (state, action) => {
    if (state.celements[action.payload.cel.id]) {
      throw new Error(
        `Celement with id: ${action.payload.cel.id} is already exist`
      );
    }

    const newHash = HashHelpers.deepCopy(state.celements);
    newHash[action.payload.cel.id] = action.payload.cel;
    state.celements = newHash;
  });

  builder.addCase(celementChangePositionAction, (state, action) => {
    const cel = { ...state.celements[action.payload.celId] };
    cel.x = action.payload.position.x;
    cel.y = action.payload.position.y;

    const newHash = HashHelpers.overrideOne(state.celements, cel);
    state.celements = newHash;
    state.lastCElementChanged = cel;
  });

  builder.addCase(celementSetLayoutAlignAction, (state, action) => {
    const cel = { ...state.celements[action.payload.celId] };

    cel.layoutAlign.vertical =
      action.payload.layoutAlign.vertical ?? cel.layoutAlign.vertical;
    cel.layoutAlign.horizontal =
      action.payload.layoutAlign.horizontal ?? cel.layoutAlign.horizontal;
    cel.layoutAlign.displayMode =
      action.payload.layoutAlign.displayMode ?? cel.layoutAlign.displayMode;
    cel.layoutAlign.flexDirection =
      action.payload.layoutAlign.flexDirection ?? cel.layoutAlign.flexDirection;

    const newHash = HashHelpers.overrideOne(state.celements, cel);
    state.celements = newHash;
    state.lastCElementChanged = cel;
  });
};
