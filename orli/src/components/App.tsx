import React from "react";
import "./App.css";
import { CElementService } from "../services/celement.service";
import * as PIXI from "pixi.js";
import { Ioc } from "../base/inversify.config";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import { watch } from "../rx/watch";
import store from "../rx/store";
import { lastCElementChangedSelector } from "../features/ui-editor/celement/celement.selectors";

import AlignHorizontalCenterIcon from "@mui/icons-material/AlignHorizontalCenter";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import AlignHorizontalRightIcon from "@mui/icons-material/AlignHorizontalRight";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import AlignVerticalBottomIcon from "@mui/icons-material/AlignVerticalBottom";
import AlignVerticalTopIcon from "@mui/icons-material/AlignVerticalTop";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  CElementLayoutAlign,
  LayoutAlign,
  LayoutDisplayMode,
  LayoutOrientation,
} from "../features/ui-editor/celement/celement-layout";
import { celementSetLayoutAlignAction } from "../features/ui-editor/celement/celemet.actions";

class State {
  celPosition: { x: number; y: number } = { x: 0, y: 0 };
  celLayoutAligin = new CElementLayoutAlign();
}

export class App extends React.Component<{}, State> {
  private readonly _cElementService: CElementService;

  private isComponentEventsBind = false;
  private isEditorCreated = false;

  constructor(props: any) {
    super(props);

    const iocContainer = Ioc.Conatiner;
    this._cElementService = iocContainer.get<CElementService>(CElementService);

    this.state = new State();
  }

  render() {
    return (
      <div id="app-wrapper">
        <div id="editor-wrapper"></div>
        <div id="properties-wrapper">
          <div className="row cel-coord">
            <Input
              className="input x-coord"
              type="number"
              startAdornment={
                <InputAdornment position="start">w:</InputAdornment>
              }
              value={Math.round(this.state.celPosition.x)}
            />

            <Input
              className="input y-coord"
              type="number"
              startAdornment={
                <InputAdornment position="start">h:</InputAdornment>
              }
              value={Math.round(this.state.celPosition.y)}
            />
          </div>

          <div className="row cel-layout-align">
            <div className="absolute-align">
              <ToggleButton
                className="action-btn"
                value={LayoutDisplayMode.Flex}
                size="large"
                selected={this.state.celLayoutAligin.displayMode === LayoutDisplayMode.Flex}
                onChange={() => this.onCelLayoutDisplayModeChanged(this.state.celLayoutAligin.displayMode === LayoutDisplayMode.Flex ? LayoutDisplayMode.Absolute : LayoutDisplayMode.Flex)}
              >
                <CheckBoxOutlineBlankIcon />
              </ToggleButton>
            </div>

            <div className="flex-align">
              <ToggleButtonGroup
                className="toggle horizontal-toggle"
                exclusive
                value={this.state.celLayoutAligin.horizontal}
                onChange={this.onCelHorizontalLayoutAlignChanged}
                disabled={this.state.celLayoutAligin.displayMode === LayoutDisplayMode.Absolute}
              >
                <ToggleButton
                  className="action-btn"
                  value={LayoutAlign.AlignStart}
                  key={LayoutAlign.AlignStart}
                  size="small"
                >
                  <AlignHorizontalLeftIcon />
                </ToggleButton>
                <ToggleButton
                  className="action-btn"
                  value={LayoutAlign.AlignCenter}
                  key={LayoutAlign.AlignCenter}
                  size="small"
                >
                  <AlignHorizontalCenterIcon />
                </ToggleButton>
                <ToggleButton
                  className="action-btn"
                  value={LayoutAlign.AliginEnd}
                  key={LayoutAlign.AliginEnd}
                  size="small"
                >
                  <AlignHorizontalRightIcon />
                </ToggleButton>
              </ToggleButtonGroup>

              <ToggleButtonGroup
                className="vertical-toggle"
                exclusive
                value={this.state.celLayoutAligin.vertical}
                onChange={this.onCelVerticalLayoutAlignChanged}
                disabled={this.state.celLayoutAligin.displayMode === LayoutDisplayMode.Absolute}
              >
                <ToggleButton
                  className="action-btn"
                  value={LayoutAlign.AlignStart}
                  key={LayoutAlign.AlignStart}
                  size="small"
                >
                  <AlignVerticalBottomIcon />
                </ToggleButton>
                <ToggleButton
                  className="action-btn"
                  value={LayoutAlign.AlignCenter}
                  key={LayoutAlign.AlignCenter}
                  size="small"
                >
                  <AlignVerticalCenterIcon />
                </ToggleButton>
                <ToggleButton
                  className="action-btn"
                  value={LayoutAlign.AliginEnd}
                  key={LayoutAlign.AliginEnd}
                  size="small"
                >
                  <AlignVerticalTopIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.bindEventListeners();
    this.createEditor();
  }

  private bindEventListeners() {
    if (this.isComponentEventsBind) return;

    let w = watch(() => lastCElementChangedSelector(store.getState().editor));
    store.subscribe(
      w((newVal, oldVal) => {
        this.setState({
          ...this.state,
          celPosition: { x: newVal!.x, y: newVal!.y },
          celLayoutAligin: {
            vertical: newVal!.layoutAlign.vertical,
            horizontal: newVal!.layoutAlign.horizontal,
            displayMode: newVal!.layoutAlign.displayMode,
          },
        });
      })
    );

    this.isComponentEventsBind = true;
  }

  private createEditor() {
    if (this.isEditorCreated) return;

    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application({ backgroundColor: 0xffffff });
    const { renderer } = app;

    this._cElementService.initialize(new PIXI.InteractionManager(renderer));

    const rootEl = document.getElementById("editor-wrapper") as HTMLElement;
    // (renderer as Renderer).addSystem(<any>EventSystem, 'events');
    app.resizeTo = rootEl;

    renderer.render(app.stage);
    // The application will create a canvas element for you that you
    // can then insert into the DOM
    rootEl.appendChild(app.view);

    const container = this._cElementService.createCElement(
      0,
      0,
      400,
      400,
      0x99aaaa
    );

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

    this.isEditorCreated = true;
  }

  private onCelLayoutDisplayModeChanged = (    
    displayMode: LayoutDisplayMode
  ) => {
    store.dispatch(
      celementSetLayoutAlignAction({
        celId: store.getState().editor.currentSelectedCElementId!,
        layoutAlign: {
          displayMode: displayMode
        },
      })
    );
  };

  private onCelLayoutAlignChanged(
    layourOrientation: LayoutOrientation,
    align: LayoutAlign
  ) {
    store.dispatch(
      celementSetLayoutAlignAction({
        celId: store.getState().editor.currentSelectedCElementId!,
        layoutAlign: {
          horizontal:
            layourOrientation == LayoutOrientation.Horizontal
              ? align
              : undefined,
          vertical:
            layourOrientation == LayoutOrientation.Vertical ? align : undefined,
        },
      })
    );
  }

  private onCelHorizontalLayoutAlignChanged = (
    event: React.MouseEvent<HTMLElement>,
    align: LayoutAlign
  ) => {
    if (!align) return;

    this.onCelLayoutAlignChanged(LayoutOrientation.Horizontal, align);
  };

  private onCelVerticalLayoutAlignChanged = (
    event: React.MouseEvent<HTMLElement>,
    align: LayoutAlign
  ) => {
    if (!align) return;

    this.onCelLayoutAlignChanged(LayoutOrientation.Vertical, align);
  };
}
