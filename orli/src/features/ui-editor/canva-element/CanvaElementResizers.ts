import { CElementTransformation } from "../celement/celement";
import { CanvaElementBound, CanvaElementPosition } from "./canva-element";
import { ResizerDirection, CanvaElementResizer } from "./canva-element-resizer";

export class CanvaElementResizers extends Map<
  ResizerDirection,
  CanvaElementResizer
> {
  get isMoving() {
    return Array.from(this.values()).some((x) => x.moving);
  }

  stopMoving() {
    this.forEach((x) => {
      x.moving = false;
    });
  }

  public updateResizeresPosition(
    parentCaelPosAndBound: CanvaElementPosition & CanvaElementBound) {
    Array.from(this.values()).forEach((resizer) => {
      let x = parentCaelPosAndBound.x;
      let y = parentCaelPosAndBound.y;

      switch (resizer.direction) {
        case ResizerDirection.Left:
          y += parentCaelPosAndBound.height.valueInPx / 2;
          break;
        case ResizerDirection.Top:
          x += parentCaelPosAndBound.width.valueInPx / 2;
          break;
        case ResizerDirection.Right:
          x += parentCaelPosAndBound.width.valueInPx;
          y += parentCaelPosAndBound.height.valueInPx / 2;
          break;
        case ResizerDirection.Bottom:
          x += parentCaelPosAndBound.width.valueInPx / 2;
          y += parentCaelPosAndBound.height.valueInPx;
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
