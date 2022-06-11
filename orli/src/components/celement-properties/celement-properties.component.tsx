import "./celement-properties.component.css";

import {
  Input,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React from "react";
import {
  LayoutDisplayMode,
  LayoutAlign,
  CElementLayoutAlign,
  LayoutOrientation,
  FlexDirection,
} from "../../features/ui-editor/celement/celement-layout";

import AlignHorizontalCenterIcon from "@mui/icons-material/AlignHorizontalCenter";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import AlignHorizontalRightIcon from "@mui/icons-material/AlignHorizontalRight";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import AlignVerticalBottomIcon from "@mui/icons-material/AlignVerticalBottom";
import AlignVerticalTopIcon from "@mui/icons-material/AlignVerticalTop";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { watch } from "../../rx/watch";
import {
  currentSelectedCelementSelector,
  lastCElementChangedSelector,
} from "../../features/ui-editor/celement/celement.selectors";
import store from "../../rx/store";
import {
  celementSetLayoutAlignAction,
  celementTransformAction,
} from "../../features/ui-editor/celement/celemet.actions";
import {
  CanvaElementBound,
  CanvaElementPosition,
} from "../../features/ui-editor/canva-element/canva-element";
import {
  CElementDimension,
  CElementDimensionMeasurement,
  CElementTransformation,
} from "../../features/ui-editor/celement/celement";
import { CanvaElementDimension } from "../../features/ui-editor/canva-element/canva-element-dimension";

class State {
  celPosition = new CanvaElementPosition(0, 0);
  celBound = new CanvaElementBound(
    new CanvaElementDimension(0),
    new CanvaElementDimension(0)
  );
  celLayoutAligin = new CElementLayoutAlign();
  celSelected = false;
}

export class CElementPropertiesComponent extends React.Component<{}, State> {
  private isComponentEventsBind = false;

  constructor(props: any) {
    super(props);

    this.state = new State();
  }

  render() {
    const celCoord = (
      <div className="row cel-bound-and-pos">
        <div className="cel-pos">
          <Input
            className="input x-coord"
            type="number"
            startAdornment={
              <InputAdornment position="start">x:</InputAdornment>
            }
            value={Math.round(this.state.celPosition.x)}
            onChange={(e) =>
              this.onCelementPositionChanged(Number.parseInt(e.target.value))
            }
          />

          <Input
            className="input y-coord"
            type="number"
            startAdornment={
              <InputAdornment position="start">y:</InputAdornment>
            }
            value={Math.round(this.state.celPosition.y)}
            onChange={(e) =>
              this.onCelementPositionChanged(
                undefined,
                Number.parseInt(e.target.value)
              )
            }
          />
        </div>

        <div className="cel-bound">
          <Input
            className="input width"
            type="number"
            startAdornment={
              <InputAdornment position="start">w:</InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <span
                  className="input-adorment adorment-width"
                  onClick={() => this.toggleDimensionMeasurement("width")}
                >
                  {this.state.celBound.width.measurement ===
                  CElementDimensionMeasurement.Px
                    ? "Px"
                    : "%"}
                </span>
              </InputAdornment>
            }
            value={Math.round(this.state.celBound.width.value)}
            onChange={(e) =>
              this.onCelementPositionChanged(
                undefined,
                undefined,
                Number.parseInt(e.target.value)
              )
            }
          />

          <Input
            className="input height"
            type="number"
            startAdornment={
              <InputAdornment position="start">h:</InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <span
                  className="input-adorment adorment-height"
                  onClick={() => this.toggleDimensionMeasurement("height")}
                >
                  {this.state.celBound.height.measurement ===
                  CElementDimensionMeasurement.Px
                    ? "Px"
                    : "%"}
                </span>
              </InputAdornment>
            }
            value={Math.round(this.state.celBound.height.value)}
            onChange={(e) =>
              this.onCelementPositionChanged(
                undefined,
                undefined,
                undefined,
                Number.parseInt(e.target.value)
              )
            }
          />
        </div>
      </div>
    );

    const celAlign = (
      <div className="row cel-layout-align">
        <div className="absolute-align">
          <ToggleButton
            className="action-btn btn-layout-align"
            value={LayoutDisplayMode.Flex}
            size="small"
            selected={
              this.state.celLayoutAligin.displayMode ===
              LayoutDisplayMode.Absolute
            }
            onChange={() =>
              this.onCelLayoutDisplayModeChanged(
                this.state.celLayoutAligin.displayMode ===
                  LayoutDisplayMode.Flex
                  ? LayoutDisplayMode.Absolute
                  : LayoutDisplayMode.Flex
              )
            }
          >
            <CheckBoxOutlineBlankIcon />
          </ToggleButton>

          <ToggleButton
            className="action-btn btn-direction"
            value={"ok"}
            size="small"
            disabled={
              this.state.celLayoutAligin.displayMode ===
              LayoutDisplayMode.Absolute
            }
            onChange={this.onAlignDirectionToggled}
          >
            {this.state.celLayoutAligin.flexDirection === FlexDirection.Row ? (
              <MoreHorizIcon />
            ) : (
              <MoreVertIcon />
            )}
          </ToggleButton>
        </div>

        <div className="flex-align">
          <ToggleButtonGroup
            className="toggle horizontal-toggle"
            exclusive
            value={this.state.celLayoutAligin.horizontal}
            onChange={this.onCelHorizontalLayoutAlignChanged}
            disabled={
              this.state.celLayoutAligin.displayMode ===
              LayoutDisplayMode.Absolute
            }
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
            disabled={
              this.state.celLayoutAligin.displayMode ===
              LayoutDisplayMode.Absolute
            }
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
    );

    return (
      <div id="properties-wrapper">
        {this.state.celSelected ? celCoord : undefined}

        {this.state.celSelected ? celAlign : undefined}
      </div>
    );
  }

  componentDidMount() {
    this.bindEventListeners();
  }

  private bindEventListeners() {
    if (this.isComponentEventsBind) return;

    const wLastCElementChanged = watch(() =>
      lastCElementChangedSelector(store.getState().editor)
    );
    store.subscribe(
      wLastCElementChanged((newVal, oldVal) => {
        this.setState({
          ...this.state,
          celPosition: { x: newVal!.x, y: newVal!.y },
          celBound: {
            width: new CanvaElementDimension(newVal!.width.value, undefined, newVal!.width.measurement),
            height: new CanvaElementDimension(newVal!.height.value, undefined, newVal!.height.measurement),
          },
          celLayoutAligin: {
            vertical: newVal!.layoutAlign.vertical,
            horizontal: newVal!.layoutAlign.horizontal,
            displayMode: newVal!.layoutAlign.displayMode,
            flexDirection: newVal!.layoutAlign.flexDirection,
          },
        });
      })
    );

    const wCurrentSelectedCelement = watch(() =>
      currentSelectedCelementSelector(store.getState().editor)
    );
    store.subscribe(
      wCurrentSelectedCelement((newId, oldId) => {
        this.setState({
          ...this.state,
          celSelected: newId !== undefined,
        });
      })
    );

    this.isComponentEventsBind = true;
  }

  private onCelLayoutDisplayModeChanged = (displayMode: LayoutDisplayMode) => {
    store.dispatch(
      celementSetLayoutAlignAction({
        celId: store.getState().editor.currentSelectedCElementId!,
        layoutAlign: {
          displayMode: displayMode,
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

  private onAlignDirectionToggled = (event: React.MouseEvent<HTMLElement>) => {
    store.dispatch(
      celementSetLayoutAlignAction({
        celId: store.getState().editor.currentSelectedCElementId!,
        layoutAlign: {
          flexDirection:
            this.state.celLayoutAligin.flexDirection === FlexDirection.Column
              ? FlexDirection.Row
              : FlexDirection.Column,
        },
      })
    );
  };

  private onCelementPositionChanged = (
    x?: number,
    y?: number,
    widthVal?: number,
    heightVal?: number
  ) => {
    const width = widthVal
      ? new CElementDimension(widthVal, this.state.celBound.width.measurement)
      : undefined;
    const height = heightVal
      ? new CElementDimension(heightVal, this.state.celBound.height.measurement)
      : undefined;

    store.dispatch(
      celementTransformAction({
        celId: store.getState().editor.currentSelectedCElementId!,
        transformation: new CElementTransformation(x, y, width, height),
      })
    );
  };

  private toggleDimensionMeasurement = (dimensionSide: "width" | "height") => {
    const width =
      dimensionSide === "width"
        ? new CElementDimension(
            this.state.celBound.width.value,
            this.state.celBound.width.measurement ===
            CElementDimensionMeasurement.Percent
              ? CElementDimensionMeasurement.Px
              : CElementDimensionMeasurement.Percent
          )
        : undefined;

    const height =
      dimensionSide === "height"
        ? new CElementDimension(
            this.state.celBound.height.value,
            this.state.celBound.height.measurement ===
            CElementDimensionMeasurement.Percent
              ? CElementDimensionMeasurement.Px
              : CElementDimensionMeasurement.Percent
          )
        : undefined;

    store.dispatch(
      celementTransformAction({
        celId: store.getState().editor.currentSelectedCElementId!,
        transformation: new CElementTransformation(
          undefined,
          undefined,
          width,
          height
        ),
      })
    );
  };
}
