import { inject, injectable } from "inversify";
import { CanvaElement } from "../features/ui-editor/canva-element/canva-element";
import * as PIXI from "pixi.js";
import store from "../rx/store";
import { editorMouseMoveAction } from "../features/ui-editor/editor/editor.actions";
import { celementSelectAction } from "../features/ui-editor/celement/celemet.actions";
import { InteractionEvent } from "pixi.js";
import { CElementDimension } from "../features/ui-editor/celement/celement";
import { EditorService } from "./editor.service";
import { watch } from "../rx/watch";
import {
  lastCelementCreateSelector,
  lastCelementRemovedSelector,
} from "../features/ui-editor/celement/celement.selectors";

@injectable()
export class CanvaElementService {
  private readonly _els = new Map<string, CanvaElement>();

  @inject(EditorService)
  private readonly _editorService!: EditorService;

  private _stageInteractionManager!: PIXI.InteractionManager;

  /* 
    Need to determinate if selected element was not changed on mouse click
   */
  private _currentSelectedCelId: string | undefined = undefined;

  constructor() {
    this.bindEvents();
  }

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

  createCael(
    x: number,
    y: number,
    width: CElementDimension,
    height: CElementDimension,
    fill = 0xed04ff,
    toParentId?: string
  ) {
    const cael = new CanvaElement(x, y, width, height, fill);
    this._els.set(cael.id, cael);

    cael.onResizeStop.subscribe(() => {
      this.stopCelResizing();
    });

    if (toParentId) {
      const parentCael = this._els.get(toParentId);

      if (!parentCael) throw Error(`No cael found for id ${toParentId}`);

      parentCael.addChild(cael);
    } else {
      this._editorService.app.stage.addChild(cael.graphics);
    }

    return cael;
  }

  getCael(id: string) {
    return this._els.get(id);
  }

  removeCael(celId: string) {
    const cael = this._els.get(celId);

    if (!cael) return;

    cael.destroy();
    this._els.delete(celId);
    cael.parent?.redraw();
  }

  /** Bind essential events to @see CanvaElementService */
  private bindEvents() {
    const wlastCelementRemoved = watch(() =>
      lastCelementRemovedSelector(store.getState().editor)
    );
    store.subscribe(
      wlastCelementRemoved((newVal, oldVal) => {
        if (!newVal) return;

        this.removeCael(newVal.id);
      })
    );

    const wlastCelementCreate = watch(() =>
      lastCelementCreateSelector(store.getState().editor)
    );
    store.subscribe(
      wlastCelementCreate((newVal, oldVal) => {
        if (!newVal) return;

        this.createCael(
          newVal.cel.x,
          newVal.cel.y,
          newVal.cel.width,
          newVal.cel.height,
          undefined,
          newVal.toParentCelId
        );
      })
    );
  }

  private stopCelResizing() {
    this._els.forEach((cel) => {
      cel.resizers.forEach((res) => (res.moving = false));
    });
  }
}
