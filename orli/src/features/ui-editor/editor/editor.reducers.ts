import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { editorInitialState } from "../editor.state";
import { editorMouseMoveAction } from "./editor.actions";

export const editorReducerMapBuilder = (builder: ActionReducerMapBuilder<typeof editorInitialState>) => {
    builder.addCase(editorMouseMoveAction, (state, action) => {
        state.lastEditorMouseMove = action.payload;
    });
};