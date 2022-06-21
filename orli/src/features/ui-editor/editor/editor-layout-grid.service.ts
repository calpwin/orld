import { inject, injectable } from "inversify";
import { ApplicationService } from "../../application/application.service";
import { EditorMediaType } from "./editor-media-type";
import * as PIXI from "pixi.js";

@injectable()
export class EditorLayoutGridService {
  @inject(ApplicationService)
  private readonly _applicationService!: ApplicationService;

  private _rootLayoutGridGraphics = new PIXI.Graphics();

  /** Recreate layout grid root Cael.
   * Cael will be child to editor root Cael and has its dimensions
   * @param rootCaelWidthInPx width of editor root cael in px
   * @param media current editor layout media
   * @param gapInPercent layout grid gap width in percent
   */
  recreateLayoutGrid(
    media: EditorMediaType,
    gapInPercent = 2
  ) {
    let columnsCount;
    switch (media) {
      case EditorMediaType.Default:
        columnsCount = 12;
        break;
      case EditorMediaType.Desktop:
        columnsCount = 12;
        break;
      case EditorMediaType.Laptop:
        columnsCount = 8;
        break;
      case EditorMediaType.Tablet:
        columnsCount = 8;
        break;
      case EditorMediaType.Phone:
        columnsCount = 4;
        break;
      default:
        throw Error(`Editor layout media ${EditorMediaType[media]} is not supported`);
    }

    const rootCael = this._applicationService.rootCael;
    const rootCaelWidthInPx = rootCael.innerBound.width;
    const gapInPx = (rootCaelWidthInPx * gapInPercent) / 100;
    const sumGapInPx = gapInPx * (columnsCount - 1);
    const columnWidthInPx = (rootCaelWidthInPx - sumGapInPx) / columnsCount;

    this._rootLayoutGridGraphics.clear();

    this._rootLayoutGridGraphics.beginFill(0x1555ed);

    let marginX = rootCael.innerPosition.x;;
    for (let index = 0; index < columnsCount; index++) {
      this._rootLayoutGridGraphics.drawRect(
        marginX,
        rootCael.innerPosition.y,
        columnWidthInPx,
        rootCael.innerBound.height
      );

      marginX += gapInPx + columnWidthInPx;
    }

    this._rootLayoutGridGraphics.endFill();

    rootCael.graphics.addChild(this._rootLayoutGridGraphics);
  }
}
