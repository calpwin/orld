import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { HashHelpers } from "../../../helpers/hash.helper";
import { editorInitialState } from "../editor.state";
import { CElement, CElementTransformation } from "./celement";
import { FlexDirection, LayoutAlign } from "./celement-layout";
import {
  celementAddedAction,
  celementChangePositionQuietAction,
  celementCreateAction,
  celementRemoveAction,
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

  builder.addCase(celementCreateAction, (state, action) => {
    state.lastCElementCreate = {
      cel: action.payload.cel,
      toParentCelId: action.payload.toParentCelId,
    };
  });

  builder.addCase(celementAddedAction, (state, action) => {
    if (state.celements[action.payload.cel.id]) {
      throw new Error(
        `Celement with id: ${action.payload.cel.id} is already exist`
      );
    }

    let newHash = HashHelpers.deepCopy(state.celements);
    newHash[action.payload.cel.id] = action.payload.cel;

    if (action.payload.cel.parentCelId) {
      const parentCel = {...state.celements[action.payload.cel.parentCelId]};
      parentCel.childrenCelIds.push(action.payload.cel.id);

      newHash = HashHelpers.overrideOne(newHash, parentCel);
    }

    state.celements = newHash;
  });

  builder.addCase(celementRemoveAction, (state, action) => {
    const cel = state.celements[action.payload.celId];

    let entries = HashHelpers.toEntries(state.celements);

    const removeOne = (cel: CElement) => {
      entries = entries.filter(
        (x) => x[1].id !== cel.id && x[1].id !== cel.parentCelId
      );

      if (cel.parentCelId) {
        let parentCel = entries.find((x) => x[0] === cel.parentCelId)?.[1];

        if (parentCel) {
          parentCel = {...state.celements[cel.parentCelId]!}
          parentCel.childrenCelIds = parentCel.childrenCelIds.filter(
            (celId) => celId === cel.id
          );
          entries.push([parentCel.id, parentCel]);
        }
      }

      if (action.payload.withChildren) {
        cel.childrenCelIds.forEach((childId) => {
          removeOne(state.celements[childId]);
        });
      }
    };

    removeOne(cel);

    state.celements = HashHelpers.create(entries);
    state.lastCElementRemoved = cel;
  });

  builder.addCase(celementChangePositionQuietAction, (state, action) => {
    const cel = {...state.celements[action.payload.celId]};
    cel.x = action.payload.position.x;
    cel.y = action.payload.position.y;

    const newHash = HashHelpers.overrideOne(state.celements, cel);
    state.celements = newHash;
    state.lastCElementChanged = cel;
    // state.lastCElementTransformed = {
    //   celId: cel.id,
    //   transformation: new CElementTransformation(
    //     action.payload.position.x,
    //     action.payload.position.y
    //   ),
    // };
  });

  builder.addCase(celementTransformAction, (state, action) => {
    if (action.payload.transformation.isEmpty()) return;

    const cel = {...state.celements[action.payload.celId]};
    cel.x = action.payload.transformation.x ?? cel.x;
    cel.y = action.payload.transformation.y ?? cel.y;
    cel.width = action.payload.transformation.width ?? cel.width;
    cel.height = action.payload.transformation.height ?? cel.height;
    action.payload.transformation.margins?.forEach((margin) =>
      cel.margins.set(margin)
    );
    action.payload.transformation.paddings?.forEach((padding) =>
      cel.paddings.set(padding)
    );

    const newHash = HashHelpers.overrideOne(state.celements, cel);
    state.celements = newHash;
    state.lastCElementChanged = cel;
    state.lastCElementTransformed = {
      celId: cel.id,
      transformation: new CElementTransformation(
        action.payload.transformation.x,
        action.payload.transformation.y,
        action.payload.transformation.width,
        action.payload.transformation.height,
        action.payload.transformation.margins,
        action.payload.transformation.paddings
      ),
    };
  });

  builder.addCase(celementSetLayoutAlignAction, (state, action) => {
    const cel = {...state.celements[action.payload.celId]};

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
        undefined,
        undefined,
        action.payload.layoutAlign
      ),
    };
  });
};
