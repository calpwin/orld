import { Graphics, Circle, Rectangle, InteractionEvent } from 'pixi.js';
import { FlexboxAdapter } from './flexbox-adapter';

export class CElement {
  readonly id!: string;

  private _rectangle!: Graphics;
  private _rectangleFill!: number;
  private readonly _resizers = new Resizers();

  private readonly _children = new Map<string, CElement>();
  get children() {
    return Array.from(this._children.values());
  }

  private _rectMoving = false;

  get graphics() {
    return this._rectangle;
  }

  constructor() {
    this.id = this.createId();
  }

  create(x: number, y: number, width: number, height: number, fill = 0xffffff) {
    this._rectangle = new Graphics();
    this._rectangleFill = fill;

    this._rectangle.beginFill(this._rectangleFill);
    this._rectangle.drawRect(x, y, width, height);

    const bounds = this._rectangle.getBounds();
    this._rectX = bounds.x;
    this._rectY = bounds.y;
    this._rectWidth = bounds.width;
    this._rectHeight = bounds.height;

    this._rectangle.endFill();

    [
      this.addResizer(ResizerDirection.Left),
      this.addResizer(ResizerDirection.Top),
      this.addResizer(ResizerDirection.Right),
      this.addResizer(ResizerDirection.Bottom),
    ].forEach((x) => {
      this._rectangle.addChild(x.circle);
      this._resizers.set(x.direction, x);
    });

    this.updateResizeresPosition();

    this._rectangle.interactive = true;

    this._rectangle.on('mouseup', (event) => {
      this._resizers.stopMoving();
    });

    this.makeMovable();

    return this._rectangle;
  }

  addChild(child: CElement) {
    this._rectangle.addChild(child._rectangle);
    this._children.set(child.id, child);
  }

  getChild(child: CElement) {
    return this._children.get(child.id);
  }

  setPosition(x: number, y: number) {
    this._rectangle.clear();
    this._rectangle.beginFill(this._rectangleFill);
    this._rectangle.drawRect(x, y, this._rectWidth, this._rectHeight);
    this._rectangle.hitArea = new Rectangle(
      x - 10,
      y - 10,
      this._rectWidth + 20,
      this._rectHeight + 20
    );
    this._rectangle.endFill();

    this._rectX = x;
    this._rectY = y;

    this.updateResizeresPosition();
  }

  private _rectX!: number;
  private _rectWidth!: number;
  private _rectY!: number;
  private _rectHeight!: number;

  get bound() {
    return {
      x: this._rectX,
      y: this._rectY,
      width: this._rectWidth,
      height: this._rectHeight,
    };
  }

  private makeMovable() {
    let startMoveX = 0;
    let startMoveY = 0;

    this._rectangle.on('mousedown', (event: InteractionEvent) => {
      this._rectMoving = true;
      startMoveX = event.data.global.x;
      startMoveY = event.data.global.y;

      event.stopPropagation();
    });

    this._rectangle.on('mousemove', (event: InteractionEvent) => {
      if (!this._rectMoving || this._resizers.isMoving) return;
      this._rectangle.x += event.data.global.x - startMoveX;
      this._rectangle.y += event.data.global.y - startMoveY;

      startMoveX = event.data.global.x;
      startMoveY = event.data.global.y;

      event.stopPropagation();
    });

    this._rectangle.on('mouseup', (event: InteractionEvent) => {
      this._rectMoving = false;

      event.stopPropagation();
    });
  }

  private addResizer(direction: ResizerDirection) {
    let x = this._rectX;
    let y = this._rectY;

    const circle = new Graphics();
    circle.beginFill(0x9966ff);
    circle.drawCircle(0, 0, 3);
    circle.hitArea = new Circle(circle.x, circle.y, 10);
    circle.endFill();
    // circle.x = x;
    // circle.y = y;

    circle.interactive = true;

    let startMoveX = x;
    let startMoveY = y;

    let offsetX = 0;
    let offsetY = 0;

    circle.on('mousedown', (event) => {
      this._resizers.get(direction)!.moving = true;
      startMoveX = event.data.global.x;
      startMoveY = event.data.global.y;
    });

    circle.on('mousemove', (event) => {
      if (!this._resizers.get(direction)!.moving) return;

      offsetX = event.data.global.x - startMoveX;
      offsetY = event.data.global.y - startMoveY;

      switch (direction) {
        case ResizerDirection.Left:
          this._rectX += offsetX;
          this._rectWidth -= offsetX;
          circle.x += offsetX;
          break;
        case ResizerDirection.Top:
          this._rectY += offsetY;
          this._rectHeight -= offsetY;
          circle.y += offsetY;
          break;
        case ResizerDirection.Right:
          this._rectWidth += offsetX;
          circle.x += offsetX;
          break;
        case ResizerDirection.Bottom:
          this._rectHeight += offsetY;
          circle.y += offsetY;
          break;
      }

      startMoveX = event.data.global.x;
      startMoveY = event.data.global.y;

      this.setPosition(this._rectX, this._rectY);

      new FlexboxAdapter().syncChildren(this);
    });

    circle.on('mouseup', (event) => {
      this._resizers.get(direction)!.moving = false;
    });

    return new Resizer(circle, direction);
  }

  private updateResizeresPosition() {
    Array.from(this._resizers.values()).forEach((resizer) => {
      let x = this._rectX;
      let y = this._rectY;

      switch (resizer.direction) {
        case ResizerDirection.Left:
          y += this._rectHeight / 2;
          break;
        case ResizerDirection.Top:
          x += this._rectWidth / 2;
          break;
        case ResizerDirection.Right:
          x += this._rectWidth;
          y += this._rectHeight / 2;
          break;
        case ResizerDirection.Bottom:
          x += this._rectWidth / 2;
          y += this._rectHeight;
          break;
      }

      resizer.circle.x = x;
      resizer.circle.y = y;
    });
  }

  private createId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

enum ResizerDirection {
  Left = 1,
  Right = 2,
  Top = 3,
  Bottom = 4,
}

class Resizer {
  moving = false;

  constructor(
    readonly circle: Graphics,
    readonly direction: ResizerDirection
  ) {}
}

class Resizers extends Map<ResizerDirection, Resizer> {
  get isMoving() {
    return Array.from(this.values()).some((x) => x.moving);
  }

  stopMoving() {
    this.forEach((x) => {
      x.moving = false;
    });
  }

  syncPositionWith(resizerDir: ResizerDirection, position: number) {
    const resizer = this.get(resizerDir)!;

    switch (resizer.direction) {
      case ResizerDirection.Left:
        this.get(ResizerDirection.Top)!.circle.x = position;
        this.get(ResizerDirection.Bottom)!.circle.x = position;
        break;
      case ResizerDirection.Top:
        this.get(ResizerDirection.Left)!.circle.y = position;
        this.get(ResizerDirection.Right)!.circle.y = position;
        break;
      case ResizerDirection.Right:
        this.get(ResizerDirection.Top)!.circle.x = position;
        this.get(ResizerDirection.Bottom)!.circle.x = position;
        break;
      case ResizerDirection.Bottom:
        this.get(ResizerDirection.Left)!.circle.y = position;
        this.get(ResizerDirection.Right)!.circle.y = position;
        break;
    }
  }
}
