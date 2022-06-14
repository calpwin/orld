import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { HashHelpers } from "../../../helpers/hash.helper";
import { CElementHash, editorInitialState } from "../editor.state";
import { CElement, CElementTransformation } from "./celement";
import { FlexDirection, LayoutAlign } from "./celement-layout";
import {
  celementAddAction,
  celementChangePositionAction,
  celementSelectAction,
  celementSetLayoutAlignAction,
  celementTransformAction,
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
    state.lastCElementTransformed = {
      celId: cel.id,
      transformation: new CElementTransformation(
        action.payload.position.x,
        action.payload.position.y
      ),
    };
  });

  builder.addCase(celementTransformAction, (state, action) => {
    if (action.payload.transformation.isEmpty()) return;

    const cel = { ...state.celements[action.payload.celId] };
    cel.x = action.payload.transformation.x ?? cel.x;
    cel.y = action.payload.transformation.y ?? cel.y;
    cel.width = action.payload.transformation.width ?? cel.width;
    cel.height = action.payload.transformation.height ?? cel.height;

    const newHash = HashHelpers.overrideOne(state.celements, cel);
    state.celements = newHash;
    state.lastCElementChanged = cel;
    state.lastCElementTransformed = {
      celId: cel.id,
      transformation: new CElementTransformation(
        action.payload.transformation.x,
        action.payload.transformation.y,
        action.payload.transformation.width,
        action.payload.transformation.height
      ),
    };
  });

  builder.addCase(celementSetLayoutAlignAction, (state, action) => {
    const cel = { ...state.celements[action.payload.celId] };

    // Should centered align for non main axis,
    // as not all aligns supported for it
    if (action.payload.layoutAlign.flexDirection == FlexDirection.Column) {
      action.payload.layoutAlign.horizontal = LayoutAlign.AlignCenter;
    } else if (action.payload.layoutAlign.flexDirection == FlexDirection.Row) {
      action.payload.layoutAlign.vertical = LayoutAlign.AlignCenter;
    }

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
    state.lastCElementTransformed = {
      celId: cel.id,
      transformation: new CElementTransformation(
        undefined,
        undefined,
        undefined,
        undefined,
        action.payload.layoutAlign
      ),
    };
  });
};
