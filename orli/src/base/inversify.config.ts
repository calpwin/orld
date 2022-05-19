import { Container } from "inversify";
import { CElementService } from "../services/celement.service";

var iocContainer = new Container();
iocContainer.bind<CElementService>(CElementService).toSelf();

export class Ioc {
    static readonly Conatiner = iocContainer;
}