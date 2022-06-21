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

  updateResizeresPosition(
    parentCaelPosition: CanvaElementPosition,
    parentCaelBound: CanvaElementBound) {
    Array.from(this.values()).forEach((resizer) => {
      let x = parentCaelPosition.x.valueInPx + parentCaelBound.margins.left.value;
      let y = parentCaelPosition.y + parentCaelBound.margins.top.value;

      switch (resizer.direction) {
        case ResizerDirection.Left:
          y += parentCaelBound.height.valueInPx / 2;
          break;
        case ResizerDirection.Top:
          x += parentCaelBound.width.valueInPx / 2;
          break;
        case ResizerDirection.Right:
          x += parentCaelBound.width.valueInPx;
          y += parentCaelBound.height.valueInPx / 2;
          break;
        case ResizerDirection.Bottom:
          x += parentCaelBound.width.valueInPx / 2;
          y += parentCaelBound.height.valueInPx;
          break;
      }

      resizer.circle.x = x;
      resizer.circle.y = y;
    });
  }

  destroyAll() {
    this.forEach(resizer => resizer.destroy());
  }
}
