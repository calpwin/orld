import React from "react";
import "./App.css";
import { CanvaElementService } from "../services/canva-element.service";
import { Ioc } from "../base/config.inversify";

import { CElementPropertiesComponent } from "./celement-properties/celement-properties.component";
import { CElementAddNewComponent } from "./celement-add-new/celement-add-new.component";
import { currentSelectedCelementSelector } from "../features/ui-editor/celement/celement.selectors";
import store from "../rx/store";
import { watch } from "../rx/watch";
import { EditorService } from "../services/editor.service";
import { ChooseMediaComponent } from "./choose-media/choose-media.component";

export class App extends React.Component<{}, {}> {
  private readonly _cElementService: CanvaElementService;
  private readonly _editorService!: EditorService;

  private _isEditorCreated = false;
  private _isEditorEventsBinded = false;

  constructor(props: any) {
    super(props);

    const iocContainer = Ioc.Conatiner;
    this._cElementService =
      iocContainer.get<CanvaElementService>(CanvaElementService);
    this._editorService = iocContainer.get<EditorService>(EditorService);
  }

  render() {
    return (
      <div id="app-wrapper">
        <ChooseMediaComponent />

        <div id="editor-wrapper">
          <CElementAddNewComponent />

          <div id="editor-canva-wrapper"></div>

          <CElementPropertiesComponent />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.createEditor();
    this.bindEditorEvents();
  }

  private createEditor() {
    if (this._isEditorCreated) return;

    this._editorService.createEditor();
    this._editorService.recreateRootCael(store.getState().editor.editorMedia);

    this._isEditorCreated = true;
  }

  private bindEditorEvents() {
    if (this._isEditorEventsBinded) return;

    let wSelectedCel = watch(() =>
      currentSelectedCelementSelector(store.getState().editor)
    );
    store.subscribe(
      wSelectedCel((newId, oldId) => {        
        if (oldId) {
          const oldCel = this._cElementService.getCael(oldId);
          oldCel && (oldCel.isSelected = false);
        }

        if (!newId) return;

        const cel = this._cElementService.getCael(newId)!;
        cel.isSelected = true;
      })
    );

    this._isEditorEventsBinded = true;
  }
}
