import { CElementLayoutAlign } from "./celement-layout";

export class CElement {
  public layoutAlign = new CElementLayoutAlign();

  constructor(
    public id: string, 
    public x: number, 
    public y: number) {
    }
}
