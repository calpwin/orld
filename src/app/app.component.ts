import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { CElementService } from 'src/services/celement.service';

@Component({
  selector: 'orli-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('rootView') rootView!: ElementRef;

  constructor(private readonly _cElementService: CElementService) {}

  ngAfterViewInit(): void {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application({ backgroundColor: 0xffffff });

    const { renderer } = app;
    // (renderer as Renderer).addSystem(<any>EventSystem, 'events');
    app.resizeTo = this.rootView.nativeElement;

    renderer.render(app.stage);
    // The application will create a canvas element for you that you
    // can then insert into the DOM
    this.rootView.nativeElement.appendChild(app.view);

    const container = this._cElementService.createCElement(0, 0, 400, 400, 0x99aaaa);

    const cel1 = this._cElementService.createCElement(0, 20, 60, 30, 0x66ccff);
    cel1.graphics.x = container.graphics.x;
    container.addChild(cel1);

    const cel2 = this._cElementService.createCElement(0, 50, 60, 30, 0x66ccff);
    cel2.graphics.x = container.graphics.x;
    container.addChild(cel2);

    // const circle = container.graphics.drawCircle(0, 0, 10);
    // circle.beginFill(0x66ccff);
    // circle.endFill();
    // container.graphics.addChild(circle);

    app.stage.addChild(container.graphics);
  }

  example(app: PIXI.Application) {
    // load the texture we need
    app.loader.add('bunny', 'assets/bunny.png').load((loader, resources) => {
      // This creates a texture from a 'bunny.png' image
      const bunny = new PIXI.Sprite(resources['bunny'].texture);

      // Setup the position of the bunny
      bunny.x = app.renderer.width / 2;
      bunny.y = app.renderer.height / 2;

      // Rotate around the center
      bunny.anchor.x = 0.5;
      bunny.anchor.y = 0.5;

      // Add the bunny to the scene we are building
      app.stage.addChild(bunny);

      // Listen for frame updates
      app.ticker.add(() => {
        // each frame we spin the bunny around a bit
        bunny.rotation += 0.01;
      });
    });
  }
}
