import { Circle, Graphics } from "pixi.js";
import {
  CanvaElement,
  CanvaElementBound,
  CanvaElementPosition,
} from "./canva-element";
import { watch } from "../../../rx/watch";
import store from "../../../rx/store";
import { lastEditorMouseMoveSelector } from "../editor/editor.selectors";
import {
  celementChangePositionAction,
  celementTransformAction,
} from "../celement/celemet.actions";
import { FlexboxAdapter } from "../../../services/flexbox-adapter";
import { CElementTransformation } from "../celement/celement";

export enum ResizerDirection {
  Left = 1,
  Right = 2,
  Top = 3,
  Bottom = 4,
}

export class CanvaElementResizer {
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
    readonly _parentCael: CanvaElement
  ) {
    this._circle = new Graphics();
    this._circle.beginFill(0x9966ff);
    this._circle.drawCircle(0, 0, 3);
    this._circle.hitArea = new Circle(this._circle.x, this._circle.y, 10);
    this._circle.endFill();

    this._circle.interactive = true;

    // this._startMoveX = this._parentCael.bound.x;
    // this._startMoveY = this._parentCael.bound.y;

    this.bindevents();
  }

  private bindevents() {
    this._circle.on("mousedown", (event) => {
      this._moving = true;
      this._startMoveX = event.data.global.x;
      this._startMoveY = event.data.global.y;

      event.stopPropagation();
    });

    this._circle.on("mouseup", (event) => {
      this._parentCael.onResizeStop.next(this._parentCael.id);

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
          this._parentCael.bound.width,
          this._parentCael.bound.height
        );
        const parentCaelPostion = new CanvaElementPosition(
          this._parentCael.position.x,
          this._parentCael.position.y
        );

        this._offsetX = newVal.x - this._startMoveX;
        this._offsetY = newVal.y - this._startMoveY;

        switch (this._direction) {
          case ResizerDirection.Left:
            parentCaelPostion.x += this._offsetX;
            parentCaelBound.width -= this._offsetX;
            this._circle.x += this._offsetX;
            break;
          case ResizerDirection.Top:
            parentCaelPostion.y += this._offsetY;
            parentCaelBound.height -= this._offsetY;
            this._circle.y += this._offsetY;
            break;
          case ResizerDirection.Right:
            parentCaelBound.width += this._offsetX;
            this._circle.x += this._offsetX;
            break;
          case ResizerDirection.Bottom:
            parentCaelBound.height += this._offsetY;
            this._circle.y += this._offsetY;
            break;
        }

        this._startMoveX = newVal.x;
        this._startMoveY = newVal.y;

        store.dispatch(
          celementTransformAction({
            celId: this._parentCael.id,
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
