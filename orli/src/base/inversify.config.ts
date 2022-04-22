import { Container } from "inversify";
import { CElementService } from "../services/celement.service";
import { IocTypes } from "./ioc-types";

const myContainer = new Container();
myContainer.bind<CElementService>(IocTypes.CElementService).to(CElementService);

export { myContainer };