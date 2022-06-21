import { ApplicationService } from "../features/application/application.service";
import { EditorLayoutGridService } from "../features/ui-editor/editor/editor-layout-grid.service";
import { CanvaElementService } from "../services/canva-element.service";
import { EditorService } from "../services/editor.service";
import { FlexboxAdapter } from "../services/flexbox-adapter";
import { Ioc } from "./config.inversify";

export function bindInversify() {
  const iocContainer = Ioc.Conatiner;
  iocContainer.bind<ApplicationService>(ApplicationService).toSelf().inSingletonScope();
  iocContainer.bind<EditorService>(EditorService).toSelf().inSingletonScope();
  iocContainer.bind<CanvaElementService>(CanvaElementService).toSelf().inSingletonScope();
  iocContainer.bind<FlexboxAdapter>(FlexboxAdapter).toSelf().inSingletonScope();
  iocContainer.bind<EditorLayoutGridService>(EditorLayoutGridService).toSelf().inSingletonScope();
}
