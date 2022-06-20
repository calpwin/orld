import { inject, injectable } from "inversify";
import { CanvaElement } from "../features/ui-editor/canva-element/canva-element";
import * as PIXI from "pixi.js";
import store from "../rx/store";
import { editorMouseMoveAction } from "../features/ui-editor/editor/editor.actions";
import { celementSelectAction } from "../features/ui-editor/celement/celemet.actions";
import { InteractionEvent } from "pixi.js";
import {
  CElement,
  CElementDimension,
  CElementToCreate,
} from "../features/ui-editor/celement/celement";
import { watch } from "../rx/watch";
import {
  lastCelementCreateSelector,
  lastCelementRemovedSelector,
} from "../features/ui-editor/celement/celement.selectors";
import { ApplicationService } from "../features/application/application.service";

@injectable()
export class CanvaElementService {
  @inject(ApplicationService)
  private readonly _applicationService!: ApplicationService;

  private readonly _els = new Map<string, CanvaElement>();

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

  /** Recreate Caels from cels */
  recreateFromCels(cels: CElement[]) {
    cels.forEach((cel) => {
      this.createCael(cel, cel.parentCelId);
    });
  }

  // createCael(
  //   x: number,
  //   y: number,
  //   width: CElementDimension,
  //   height: CElementDimension,
  //   fill = 0xed04ff,
  //   toParentId?: string
  // )
  createCael(celToCreate: CElementToCreate, toParentId?: string) {
    const parentCael = toParentId ? this._els.get(toParentId) : undefined;

    const cael = new CanvaElement(celToCreate, parentCael);
    this._els.set(cael.id, cael);

    cael.onResizeStop.subscribe(() => {
      this.stopCelResizing();
    });

    if (parentCael) {
      if (!parentCael) throw Error(`No cael found for id ${toParentId}`);

      cael.parent = parentCael;
      parentCael.addChild(cael);
    } else {
      this._applicationService.app.stage.addChild(cael.graphics);
    }

    return cael;
  }

  getCael(id: string) {
    return this._els.get(id);
  }

  getAllCaels() {
    return Array.from(this._els.values());
  }

  removeCael(celId: string) {
    const cael = this._els.get(celId);

    if (!cael) return;

    cael.destroy();
    this._els.delete(celId);
    cael.children.forEach((child) => this._els.delete(child.id));
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

        this.createCael(newVal.cel, newVal.toParentCelId);
      })
    );
  }

  private stopCelResizing() {
    this._els.forEach((cel) => {
      cel.resizers.forEach((res) => (res.moving = false));
    });
  }
}
