import { injectable } from "inversify";
import * as PIXI from "pixi.js";

@injectable()
export class ApplicationService {
  private _editorApp!: PIXI.Application;

  /* Get global Pixi app */
  get app() {
    return this._editorApp;
  }

  /* Set global Pixi app. Set ones at application initialization */
  set app(app: PIXI.Application) {
    this._editorApp = app;
  }
}
