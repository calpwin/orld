import { CanvaElementBound } from "./canva-element";
import { ResizerDirection, CanvaElementResizer } from "./canva-element-resizer";


export class CanvaElementResizers extends Map<ResizerDirection, CanvaElementResizer> {
  get isMoving() {
    return Array.from(this.values()).some((x) => x.moving);
  }

  stopMoving() {
    this.forEach((x) => {
      x.moving = false;
    });
  }

  public updateResizeresPosition(parentCaelBound: CanvaElementBound) {
    Array.from(this.values()).forEach((resizer) => {
      let x = parentCaelBound.x;
      let y = parentCaelBound.y;

      switch (resizer.direction) {
        case ResizerDirection.Left:
          y += parentCaelBound.height / 2;
          break;
        case ResizerDirection.Top:
          x += parentCaelBound.width / 2;
          break;
        case ResizerDirection.Right:
          x += parentCaelBound.width;
          y += parentCaelBound.height / 2;
          break;
        case ResizerDirection.Bottom:
          x += parentCaelBound.width / 2;
          y += parentCaelBound.height;
          break;
      }

      resizer.circle.x = x;
      resizer.circle.y = y;
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
