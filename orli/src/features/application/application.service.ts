import { injectable } from "inversify";
import * as PIXI from "pixi.js";
import { CanvaElement } from "../ui-editor/canva-element/canva-element";

@injectable()
export class ApplicationService {
  private _editorApp!: PIXI.Application;
  private _editorRootCael!: CanvaElement;

  /* Get global Pixi app */
  get app() {
    return this._editorApp;
  }

  /* Set global Pixi app. Set ones at application initialization */
  set app(app: PIXI.Application) {
    this._editorApp = app;
  }

  /** Get root Cael for current media */
  get rootCael() {
    return this._editorRootCael;
  }

  /** Set root Cael for current media */
  set rootCael(value: CanvaElement) {
    this._editorRootCael = value;
  }
}
