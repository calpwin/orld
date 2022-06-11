import { Container } from "inversify";

var iocContainer = new Container();

export class Ioc {
    static readonly Conatiner = iocContainer;
}