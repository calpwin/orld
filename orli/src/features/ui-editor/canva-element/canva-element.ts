import { Graphics, Rectangle, InteractionEvent } from "pixi.js";
import { Subject } from "rxjs";

import store from "../../../rx/store";
import {
  celementAddAction,
  celementSelectAction,
} from "../celement/celemet.actions";
import { CElement } from "../celement/celement";
import { CanvaElementResizer, ResizerDirection } from "./canva-element-resizer";
import { CanvaElementResizers } from "./CanvaElementResizers";

export class CanvaElement {  
  readonly id!: string;

  private _rectangle!: Graphics;
  private _rectMoving = false;
  private _rectangleFill!: number;
  private readonly _resizers = new CanvaElementResizers();

  private _rectX!: number;
  private _rectY!: number;
  private _rectWidth!: number;
  private _rectHeight!: number;

  private _isSelected = false;

  private readonly _children = new Map<string, CanvaElement>();

  get bound() {
    return new CanvaElementBound(this._rectX, this._rectY, this._rectWidth, this._rectHeight);
  }

  get children() {
    return Array.from(this._children.values());
  }

  get graphics() {
    return this._rectangle;
  }

  get resizers() {
    return this._resizers;
  }

  get isSelected() {
    return this._isSelected;
  }

  set isSelected(value: boolean) {
    this._isSelected = value;
    this.redraw();
  }

  onResizeStop = new Subject<string>();

  constructor() {
    this.id = this.createId();
  }

  create(x: number, y: number, width: number, height: number, fill = 0xffffff) {
    this._rectangle = new Graphics();
    this._rectangle.interactive = true;
    this._rectX = x;
    this._rectY = y;
    this._rectWidth = width;
    this._rectHeight = height;
    this._rectangleFill = fill;
    this.redraw();

    [
      new CanvaElementResizer(ResizerDirection.Left, this),
      new CanvaElementResizer(ResizerDirection.Top, this),
      new CanvaElementResizer(ResizerDirection.Right, this),
      new CanvaElementResizer(ResizerDirection.Bottom, this),                  
    ].forEach((x) => {
      this._rectangle.addChild(x.circle);
      this._resizers.set(x.direction, x);
    });

    this._resizers.updateResizeresPosition(this.bound);    

    this._rectangle.on("mouseup", (event) => {
      this._resizers.stopMoving();
    });

    this.makeMovable();

    store.dispatch(
      celementAddAction({
        cel: new CElement(this.id, this._rectX, this._rectY),
      })
    );

    return this._rectangle;
  }

  addChild(child: CanvaElement) {
    this._rectangle.addChild(child._rectangle);
    this._children.set(child.id, child);
  }

  getChild(child: CanvaElement) {
    return this._children.get(child.id);
  }

  setBound(x?: number, y?: number, width?: number, height?: number) {    
    this._rectX = x ?? this._rectX;
    this._rectY = y ?? this._rectY;
    this._rectWidth = width ?? this._rectWidth;
    this._rectHeight = height ?? this._rectHeight;

    this.redraw();
    this._resizers.updateResizeresPosition(this.bound);    
  }

  /* 
    redraw cel from its properties
   */
  redraw() {
    this._rectangle.clear();
    this._rectangle.beginFill(this._rectangleFill);

    if (this._isSelected) {
      this._rectangle.lineStyle(2, 0x1555ed);
    }

    this._rectangle.drawRect(this._rectX, this._rectY, this._rectWidth, this._rectHeight);
    this._rectangle.hitArea = new Rectangle(
      this._rectX - 10,
      this._rectY - 10,
      this._rectWidth + 20,
      this._rectHeight + 20
    );
    this._rectangle.endFill();
  }    

  private makeMovable() {
    let startMoveX = 0;
    let startMoveY = 0;

    this._rectangle.on("click", (event: InteractionEvent) => {
      event.stopPropagation();

      store.dispatch(celementSelectAction({ celId: this.id }));
    });

    this._rectangle.on("mousedown", (event: InteractionEvent) => {
      event.stopped = true;
      event.stopPropagationHint = true;
      event.stopPropagation();      

      this._rectMoving = true;
      startMoveX = event.data.global.x;
      startMoveY = event.data.global.y;      
    });

    this._rectangle.on("mousemove", (event: InteractionEvent) => {
      if (!this._rectMoving || this._resizers.isMoving) return;
      this._rectangle.x += event.data.global.x - startMoveX;
      this._rectangle.y += event.data.global.y - startMoveY;

      startMoveX = event.data.global.x;
      startMoveY = event.data.global.y;

      event.stopPropagation();
    });

    this._rectangle.on("mouseup", (event: InteractionEvent) => {
      event.stopPropagation();

      this._rectMoving = false;
    });
  }

  private createId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export class CanvaElementBound {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number) {
  }
}
