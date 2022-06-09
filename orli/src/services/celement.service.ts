import { injectable } from "inversify";
import { CanvaElement } from "../features/ui-editor/canva-element/canva-element";
import * as PIXI from "pixi.js";
import store from "../rx/store";
import { editorMouseMoveAction } from "../features/ui-editor/editor/editor.actions";
import { celementSelectAction } from "../features/ui-editor/celement/celemet.actions";
import { InteractionEvent } from "pixi.js";

@injectable()
export class CElementService {
  private readonly _els = new Map<string, CanvaElement>();

  private _stageInteractionManager!: PIXI.InteractionManager;

  /* 
    Need to determinate if selected element was not changed on mouse click
   */
  private _currentSelectedCelId: string | undefined = undefined;

  initialize(stageInteractionManager: PIXI.InteractionManager) {
    this._stageInteractionManager = stageInteractionManager;

    this._stageInteractionManager.on("mousemove", (event) => {
      if (event.data.global.y < 0) return;

      store.dispatch(
        editorMouseMoveAction({
          x: event.data.global.x,
          y: event.data.global.y,
        })
      );
    });
    this._stageInteractionManager.on("mouseup", (event) => {
      this.stopCelResizing();
    });
    this._stageInteractionManager.on("mousedown", (event: InteractionEvent) => {
      if (!event.stopped) {
        store.dispatch(celementSelectAction({ celId: undefined }));
      }
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

  getCElement(id: string) {
    return this._els.get(id);
  }

  private stopCelResizing() {
    this._els.forEach((cel) => {
      cel.resizers.forEach((res) => (res.moving = false));
    });
  }
}
