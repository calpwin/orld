import { Injectable } from '@angular/core';
import {
  Application,
  Circle,
  Graphics,
  InteractionManager,
  Rectangle,
} from 'pixi.js';
import { CElement } from './celement';

@Injectable({
  providedIn: 'root',
})
export class CElementService {
  private readonly _els = new Map<string, CElement>();

  createCElement(x: number, y: number, width: number, height: number, fill = 0xffffff) {
    const cel = new CElement();
    cel.create(x, y, width, height, fill);
    this._els.set(cel.id, cel);

    return cel;
  }
}
