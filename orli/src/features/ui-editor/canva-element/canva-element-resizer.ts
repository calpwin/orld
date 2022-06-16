import { Circle, Graphics } from "pixi.js";
import {
  CanvaElement,
  CanvaElementBound,
  CanvaElementPosition,
} from "./canva-element";
import { watch } from "../../../rx/watch";
import store from "../../../rx/store";
import { lastEditorMouseMoveSelector } from "../editor/editor.selectors";
import { celementTransformAction } from "../celement/celemet.actions";
import { CElementTransformation } from "../celement/celement";
import { CanvaElementDimension } from "./canva-element-dimension";
import { EditorService } from "../../../services/editor.service";
import { Ioc } from "../../../base/config.inversify";

export enum ResizerDirection {
  Left = 1,
  Right = 2,
  Top = 3,
  Bottom = 4,
}

export class CanvaElementResizer {
  private readonly _editorService: EditorService;
  private readonly _circle: Graphics;

  private _moving = false;
  private _startMoveX!: number;
  private _startMoveY!: number;
  private _offsetX = 0;
  private _offsetY = 0;

  /*  
    Get resizer graphic element circle
  */
  get circle() {
    return this._circle;
  }

  /* 
    Is resizer mouse moving
   */
  get moving() {
    return this._moving;
  }
  set moving(value: boolean) {
    this._moving = value;
  }

  /* 
    Direction where parent element will be resized
   */
  get direction() {
    return this._direction;
  }

  constructor(
    readonly _direction: ResizerDirection,
    /* Resizer Canva Element */
    readonly _cael: CanvaElement
  ) {
    this._editorService = Ioc.Conatiner.get<EditorService>(EditorService);

    this._circle = new Graphics();
    this._circle.beginFill(0x9966ff);
    this._circle.drawCircle(0, 0, 3);
    this._circle.hitArea = new Circle(this._circle.x, this._circle.y, 10);
    this._circle.endFill();

    this._circle.interactive = true;

    this.bindevents();
  }

  destroy() {
    this._circle.destroy();
  }

  private bindevents() {
    this._circle.on("mousedown", (event) => {
      this._moving = true;
      this._startMoveX = event.data.global.x;
      this._startMoveY = event.data.global.y;

      event.stopPropagation();
    });

    this._circle.on("mouseup", (event) => {
      this._cael.onResizeStop.next(this._cael.id);

      event.stopPropagation();
    });

    this.bindOnEditorMouseMoveEvent();
  }

  private bindOnEditorMouseMoveEvent() {
    let wLastEditorMouseMove = watch(() =>
      lastEditorMouseMoveSelector(store.getState().editor)
    );
    store.subscribe(
      wLastEditorMouseMove((newVal, oldVal) => {
        if (!this._moving) return;

        const parentCaelBound = new CanvaElementBound(
          this._cael.outerBound.width,
          this._cael.outerBound.height
        );
        const parentCaelPostion = new CanvaElementPosition(
          this._cael.outerPosition.x,
          this._cael.outerPosition.y
        );

        this._offsetX = newVal.x - this._startMoveX;
        this._offsetY = newVal.y - this._startMoveY;

        switch (this._direction) {
          case ResizerDirection.Left:
            parentCaelPostion.x += this._offsetX;

            parentCaelBound.width.valueInPx -= this._offsetX;
            
            CanvaElementDimension.syncDimensionWithParentDimensionRef(
              parentCaelBound.width,
               this._cael.parent?.innerBound.width ??
                this._editorService.app.stage.width
            );

            this._circle.x += this._offsetX;
            break;
          case ResizerDirection.Top:
            parentCaelPostion.y += this._offsetY;

            parentCaelBound.height.valueInPx -= this._offsetY;
            CanvaElementDimension.syncDimensionWithParentDimensionRef(
              parentCaelBound.height,
              this._cael.parent?.innerBound.height ??
                this._editorService.app.stage.height
            );

            this._circle.y += this._offsetY;
            break;
          case ResizerDirection.Right:
            parentCaelBound.width.valueInPx += this._offsetX;
            CanvaElementDimension.syncDimensionWithParentDimensionRef(
              parentCaelBound.width,
              this._cael.parent?.innerBound.width ??
                this._editorService.app.stage.width
            );

            this._circle.x += this._offsetX;
            break;
          case ResizerDirection.Bottom:
            parentCaelBound.height.valueInPx += this._offsetY;
            CanvaElementDimension.syncDimensionWithParentDimensionRef(
              parentCaelBound.height,
              this._cael.parent?.innerBound.height ??
                this._editorService.app.stage.height
            );

            this._circle.y += this._offsetY;
            break;
        }

        this._startMoveX = newVal.x;
        this._startMoveY = newVal.y;

        store.dispatch(
          celementTransformAction({
            celId: this._cael.id,
            transformation: new CElementTransformation(
              parentCaelPostion.x,
              parentCaelPostion.y,
              parentCaelBound.width,
              parentCaelBound.height
            ),
          })
        );
      })
    );
  }
}
