import { inject, injectable } from "inversify";
import * as PIXI from "pixi.js";
import { CanvaElementService } from "./canva-element.service";
import store from "../rx/store";
import { celementRemoveAction } from "../features/ui-editor/celement/celemet.actions";
import { HashHelpers } from "../helpers/hash.helper";
import { EditorMediaType } from "../features/ui-editor/editor/editor-media-type";
import { watch } from "../rx/watch";
import { lastEditorMediaSelector } from "../features/ui-editor/editor/editor.selectors";
import { ApplicationService } from "../features/application/application.service";
import { CanvaElement } from "../features/ui-editor/canva-element/canva-element";
import {
  CElement,
  CElementDimension,
  CElementDimensionExtendMeasurement,
  CElementToCreate,
} from "../features/ui-editor/celement/celement";
import { EditorLayoutGridService } from "../features/ui-editor/editor/editor-layout-grid.service";

@injectable()
export class EditorService {
  @inject(ApplicationService)
  private readonly _applicationService!: ApplicationService;

  @inject(CanvaElementService)
  private readonly _caelService!: CanvaElementService;

  @inject(EditorLayoutGridService)
  private readonly _editorLayoutGridService!: EditorLayoutGridService;

  // Editor canva Html Element
  private _editorHel!: HTMLElement;

  readonly editorWrapperHelId = "editor-canva-wrapper";

  constructor() {
    this.bindEvents();
  }

  /** Create and setup editor - canva element */
  createEditor() {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application({
      backgroundColor: 0xffffff,
      antialias: true,
    });
    const { renderer } = app;
    this._applicationService.app = app;

    this._caelService.initialize(new PIXI.InteractionManager(renderer));

    this._editorHel = document.getElementById(
      this.editorWrapperHelId
    ) as HTMLElement;
    // (renderer as Renderer).addSystem(<any>EventSystem, 'events');
    app.resizeTo = this._editorHel;

    renderer.render(app.stage);
    // The application will create a canvas element for you that you
    // can then insert into the DOM
    this._editorHel.appendChild(app.view);
  }

  /** Recreate editor root cael by current media type.
   * Will be recreated with all current media cels
   */
  recreateRootCael(media: EditorMediaType) {
    const celsHash = store.getState().editor.celements;
    const cels = HashHelpers.toEntries(celsHash).map((x) => x[1]);
    let rootCel = cels.find((x) => CElement.isRoot(x));

    if (cels.length > 0) {
      if (!rootCel) throw Error(`No root cel at cels sequence: ${cels}`);

      store.dispatch(
        celementRemoveAction({
          celId: rootCel.id,
          withChildren: true,
        })
      );
    }

    const newRootCael = this.createRootContainer(
      rootCel
        ? ({ ...rootCel } as CElementToCreate)
        : undefined ??
            new CElementToCreate(
              new CElementDimension<CElementDimensionExtendMeasurement>(0),
              0,
              new CElementDimension(this._editorHel.clientWidth),
              new CElementDimension(this._editorHel.clientHeight)
            ),
      media
    );
    this._applicationService.rootCael = newRootCael;

    this._editorLayoutGridService.recreateLayoutGrid(media);

    // Recreate children cels
    // Recreate in order from parent to children,
    // to ensure that the parent element was created when child is created
    if (rootCel) {
      const recreateCels = (_celIds: string[]) => {
        if (_celIds.length === 0) return;

        const _cels = _celIds.map((celId) => celsHash[celId]);

        this._caelService.recreateFromCels(_cels);

        _cels.forEach((_cel) => recreateCels(_cel.childrenCelIds));
      };

      recreateCels(rootCel.childrenCelIds);
    }    
  }

  private bindEvents() {
    const wlastEditorMedia = watch(() =>
      lastEditorMediaSelector(store.getState().editor)
    );
    store.subscribe(
      wlastEditorMedia((newVal, oldVal) => {
        this.recreateRootCael(newVal);
      })
    );
  }

  private createRootContainer(
    celToCreate: CElementToCreate,
    media: EditorMediaType
  ) {
    let container: CanvaElement;
    celToCreate.x.value = 0;
    celToCreate.y = 0;
    celToCreate.width = new CElementDimension(this._editorHel.clientWidth);
    celToCreate.height = new CElementDimension(this._editorHel.clientHeight);
    let color = 0x99aaaa;

    const centerXPosition = (_width: number) => {
      return (this._editorHel.clientWidth - _width) / 2;
    };

    switch (media) {
      case EditorMediaType.Default:
        container = this._caelService.createCael(celToCreate);
        break;
      case EditorMediaType.Phone:
        celToCreate.width = new CElementDimension(480);
        celToCreate.x.value = centerXPosition(celToCreate.width.value);
        container = this._caelService.createCael(celToCreate);
        break;
      case EditorMediaType.Tablet:
        celToCreate.width = new CElementDimension(768);
        celToCreate.x.value = centerXPosition(celToCreate.width.value);
        container = this._caelService.createCael(celToCreate);
        break;
      case EditorMediaType.Laptop:
        celToCreate.width = new CElementDimension(1024);
        celToCreate.x.value = centerXPosition(celToCreate.width.value);
        container = this._caelService.createCael(celToCreate);
        break;
      case EditorMediaType.Desktop:
        celToCreate.width = new CElementDimension(1200);
        celToCreate.x.value = centerXPosition(celToCreate.width.value);
        container = this._caelService.createCael(celToCreate);
        break;
      default:
        throw Error(`media ${EditorMediaType[media]} is not supported`);
    }

    return container;
  }
}
