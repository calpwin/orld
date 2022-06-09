import React from "react";
import "./App.css";
import { CElementService } from "../services/celement.service";
import * as PIXI from "pixi.js";
import { Ioc } from "../base/inversify.config";

import { CElementPropertiesComponent } from "./celement-properties/celement-properties.component";
import { CElementAddNewComponent } from "./celement-add-new/celement-add-new.component";
import { currentSelectedCelementSelector } from "../features/ui-editor/celement/celement.selectors";
import store from "../rx/store";
import { watch } from "../rx/watch";

export class App extends React.Component<{}, {}> {
  private readonly _cElementService: CElementService;

  private _isEditorCreated = false;
  private _isEditorEventsBinded = false;

  constructor(props: any) {
    super(props);

    const iocContainer = Ioc.Conatiner;
    this._cElementService = iocContainer.get<CElementService>(CElementService);

    // this.state = new State();
  }

  render() {
    return (
      <div id="app-wrapper">
        <CElementAddNewComponent />

        <div id="editor-wrapper"></div>

        <CElementPropertiesComponent />
      </div>
    );
  }

  componentDidMount() {
    this.createEditor();
    this.bindEditorEvents();
  }

  private createEditor() {
    if (this._isEditorCreated) return;

    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application({
      backgroundColor: 0xffffff,
      antialias: true,
    });
    const { renderer } = app;

    this._cElementService.initialize(new PIXI.InteractionManager(renderer));

    const rootEl = document.getElementById("editor-wrapper") as HTMLElement;
    // (renderer as Renderer).addSystem(<any>EventSystem, 'events');
    app.resizeTo = rootEl;

    renderer.render(app.stage);
    // The application will create a canvas element for you that you
    // can then insert into the DOM
    rootEl.appendChild(app.view);

    const container = this._cElementService.createCElement(
      0,
      0,
      400,
      400,
      0x99aaaa
    );

    const cel1 = this._cElementService.createCElement(0, 20, 60, 30, 0x66ccff);
    cel1.graphics.x = container.graphics.x;
    container.addChild(cel1);

    const cel2 = this._cElementService.createCElement(0, 50, 60, 30, 0x66ccff);
    cel2.graphics.x = container.graphics.x;
    container.addChild(cel2);

    app.stage.addChild(container.graphics);

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
          const cel = this._cElementService.getCElement(oldId)!;
          cel.isSelected = false;
        }

        if (!newId) return;

        const cel = this._cElementService.getCElement(newId)!;
        cel.isSelected = true;
      })
    );

    this._isEditorEventsBinded = true;
  }
}
