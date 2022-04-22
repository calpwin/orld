import React from 'react';
import logo from './logo.svg';
import './App.css';
import { CElementService } from './services/celement.service';
import * as PIXI from 'pixi.js';

export class App extends React.Component {
  render() {
    return <div id="editor-wrapper"></div>;
  }

  componentDidMount() {
    const cElementService = new CElementService();

    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application({ backgroundColor: 0xffffff });

    const { renderer } = app;

    const rootEl = document.getElementById("editor-wrapper") as HTMLElement;
    // (renderer as Renderer).addSystem(<any>EventSystem, 'events');
    app.resizeTo = rootEl;

    renderer.render(app.stage);
    // The application will create a canvas element for you that you
    // can then insert into the DOM
    rootEl.appendChild(app.view);

    const container = cElementService.createCElement(0, 0, 400, 400, 0x99aaaa);

    const cel1 = cElementService.createCElement(0, 20, 60, 30, 0x66ccff);
    cel1.graphics.x = container.graphics.x;
    container.addChild(cel1);

    const cel2 = cElementService.createCElement(0, 50, 60, 30, 0x66ccff);
    cel2.graphics.x = container.graphics.x;
    container.addChild(cel2);

    // const circle = container.graphics.drawCircle(0, 0, 10);
    // circle.beginFill(0x66ccff);
    // circle.endFill();
    // container.graphics.addChild(circle);

    app.stage.addChild(container.graphics);
  }
}
