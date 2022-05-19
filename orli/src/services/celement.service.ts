import {
  Application,
  Circle,
  Graphics,
  InteractionManager,
  Rectangle,
} from "pixi.js";
import { Container, injectable } from "inversify";
import { CanvaElement } from "./celement";
import { IocTypes } from "../base/ioc-types";
import * as PIXI from "pixi.js";
import { useDispatch } from "react-redux";
// import { editorMoouseMove } from "../features/ui-editor/ui-editor.slice";
import store from '../rx/store';
import { editorMouseMoveAction } from "../features/ui-editor/editor/editor.actions";

@injectable()
export class CElementService {
  private readonly _els = new Map<string, CanvaElement>();

  private _stageInteractionManager!: PIXI.InteractionManager;

  initialize(stageInteractionManager: PIXI.InteractionManager) {
    this._stageInteractionManager = stageInteractionManager;

    this._stageInteractionManager.on("mousemove", (event) => {
      if (event.data.global.y < 0) return;

      store.dispatch(        
        editorMouseMoveAction({ x: event.data.global.x, y: event.data.global.y })
      );
    });
    this._stageInteractionManager.on("mouseup", (event) => {
      this.stopCelResizing();
    });
  }

  createCElement(
    x: number,
    y: number,
    width: number,
    height: number,
    fill = 0xffffff
  ) {
    const cel = new CanvaElement();
    cel.create(x, y, width, height, fill);
    this._els.set(cel.id, cel);

    cel.onResizeStop.subscribe(() => {
      this.stopCelResizing();
    });

    return cel;
  }

  private stopCelResizing() {
    this._els.forEach((cel) => {
      cel.resizers.forEach((res) => (res.moving = false));
    });
  }
}
