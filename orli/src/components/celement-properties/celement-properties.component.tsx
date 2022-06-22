import "./celement-properties.component.css";

import {
  Button,
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
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { watch } from "../../rx/watch";
import {
  currentSelectedCelementSelector,
  lastCElementChangedSelector,
} from "../../features/ui-editor/celement/celement.selectors";
import store from "../../rx/store";
import {
  celementRemoveAction,
  celementSelectAction,
  celementSetLayoutAlignAction,
  celementTransformAction,
} from "../../features/ui-editor/celement/celemet.actions";
import {
  CanvaElementBound,
  CanvaElementPosition,
} from "../../features/ui-editor/canva-element/canva-element";
import {
  CElementDimension,
  CElementDimensionExtendMeasurement,
  CElementDimensionMeasurement,
  CElementLayoutGridDimensionMeasurement,
  CElementTransformation,
} from "../../features/ui-editor/celement/celement";
import { CanvaElementDimension } from "../../features/ui-editor/canva-element/canva-element-dimension";
import { CElementIndents } from "../../features/ui-editor/celement/celement-margin";
import { CElementPropertiesIndentsComponent } from "./celement-properties-indents.component";

class State {
  currentCaelId: string | undefined = undefined;
  celPosition = new CanvaElementPosition(
    new CanvaElementDimension<CElementDimensionExtendMeasurement>(0),
    0
  );
  celBound = new CanvaElementBound(
    new CanvaElementDimension(0),
    new CanvaElementDimension(0),
    new CElementIndents(),
    new CElementIndents()
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
            endAdornment={
              <InputAdornment position="end">
                <span className="input-adorment adorment-x">
                  {this.state.celPosition.x.measurement ===
                  CElementDimensionMeasurement.Px
                    ? "Px"
                    : "Gc"}
                </span>
              </InputAdornment>
            }
            value={Math.round(this.state.celPosition.x.valueInPx)}
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
            endAdornment={
              <InputAdornment position="end">
                <span className="input-adorment adorment-y">Px</span>
              </InputAdornment>
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
                    : this.state.celBound.width.measurement ===
                      CElementLayoutGridDimensionMeasurement.LayoutGrid
                    ? "Gc"
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
              value={LayoutAlign.AlignSpaceBetween}
              key={LayoutAlign.AlignSpaceBetween}
              size="small"
              disabled={
                this.state.celLayoutAligin.flexDirection ===
                FlexDirection.Column
              }
            >
              <ViewColumnIcon />
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
              value={LayoutAlign.AlignSpaceAround}
              key={LayoutAlign.AlignSpaceAround}
              size="small"
              disabled={
                this.state.celLayoutAligin.flexDirection ===
                FlexDirection.Column
              }
            >
              <ViewColumnOutlinedIcon />
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
              value={LayoutAlign.AlignSpaceBetween}
              key={LayoutAlign.AlignSpaceBetween}
              size="small"
              disabled={
                this.state.celLayoutAligin.flexDirection === FlexDirection.Row
              }
            >
              <ViewColumnIcon style={{ transform: "rotate(90deg)" }} />
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
              value={LayoutAlign.AlignSpaceAround}
              key={LayoutAlign.AlignSpaceAround}
              size="small"
              disabled={
                this.state.celLayoutAligin.flexDirection === FlexDirection.Row
              }
            >
              <ViewColumnOutlinedIcon style={{ transform: "rotate(90deg)" }} />
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

    const removeCael = (
      <div id="remove-cael-wrapper">
        <Button
          variant="contained"
          className="btn btn-remove"
          onClick={this.onCElementRemove}
        >
          Remove
        </Button>
      </div>
    );

    return (
      <div id="properties-wrapper">
        {this.state.celSelected ? celCoord : undefined}

        {this.state.celSelected ? (
          <CElementPropertiesIndentsComponent
            key={
              (this.state.currentCaelId ?? "") +
              this.state.celBound.width.measurement.toString()
            }
            indents={{
              margins: this.state.celBound.margins,
              paddings: this.state.celBound.paddings,
              showMargins:
                this.state.celBound.width.measurement !==
                CElementLayoutGridDimensionMeasurement.LayoutGrid,
              showPaddings: true,
            }}
          />
        ) : undefined}

        {this.state.celSelected ? celAlign : undefined}

        {this.state.celSelected ? removeCael : undefined}
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
          currentCaelId: newVal!.id,
          celPosition: {
            x: new CanvaElementDimension<CElementDimensionExtendMeasurement>(
              newVal!.x.value,
              undefined,
              newVal!.x.measurement
            ),
            y: newVal!.y,
          },
          celBound: new CanvaElementBound(
            new CanvaElementDimension(
              newVal!.width.value,
              undefined,
              newVal!.width.measurement
            ),
            new CanvaElementDimension(
              newVal!.height.value,
              undefined,
              newVal!.height.measurement
            ),
            newVal!.margins,
            newVal!.paddings
          ),
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
        let celStatePart = this.state;

        if (newId) {
          const cel = store.getState().editor.celements[newId];
          celStatePart = {
            ...celStatePart,
            currentCaelId: cel.id,
            celPosition: {
              x: new CanvaElementDimension<CElementDimensionExtendMeasurement>(
                cel.x.value,
                undefined,
                cel.x.measurement
              ),
              y: cel.y,
            },
            celBound: new CanvaElementBound(
              new CanvaElementDimension(
                cel.width.value,
                undefined,
                cel.width.measurement
              ),
              new CanvaElementDimension(
                cel.height.value,
                undefined,
                cel.height.measurement
              ),
              cel.margins,
              cel.paddings
            ),
            celLayoutAligin: {
              vertical: cel.layoutAlign.vertical,
              horizontal: cel.layoutAlign.horizontal,
              displayMode: cel.layoutAlign.displayMode,
              flexDirection: cel.layoutAlign.flexDirection,
            },
          };
        }

        this.setState({
          ...celStatePart,
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
        needChildrenToParentSync: true
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
        needChildrenToParentSync: true
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
        needChildrenToParentSync: true
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
        transformation: new CElementTransformation(
          x
            ? new CElementDimension<CElementDimensionExtendMeasurement>(
                x,
                this.state.celPosition.x.measurement
              )
            : undefined,
          y,
          width,
          height
        ),
        needChildrenToParentSync: true
      })
    );
  };

  private toggleDimensionMeasurement = (
    dimensionSide: "width" | "height" | "x"
  ) => {
    // const x =
    //   dimensionSide === "x"
    //     ? new CElementDimension<CElementDimensionExtendMeasurement>(
    //         this.state.celPosition.x.value,
    //         this.state.celPosition.x.measurement ===
    //         CElementDimensionMeasurement.Px
    //           ? CElementLayoutGridDimensionMeasurement.LayoutGrid
    //           : CElementDimensionMeasurement.Px
    //       )
    //     : undefined;

    const width =
      dimensionSide === "width"
        ? new CElementDimension<CElementDimensionExtendMeasurement>(
            this.state.celBound.width.value,
            this.state.celBound.width.measurement ===
            CElementDimensionMeasurement.Px
              ? CElementDimensionMeasurement.Percent
              : this.state.celBound.width.measurement ===
                CElementDimensionMeasurement.Percent
              ? CElementLayoutGridDimensionMeasurement.LayoutGrid
              : CElementDimensionMeasurement.Px
          )
        : undefined;

    let x = undefined;
    if (dimensionSide === "width") {
      if (
        width!.measurement === CElementLayoutGridDimensionMeasurement.LayoutGrid
      ) {
        x = new CElementDimension<CElementDimensionExtendMeasurement>(
          0,
          CElementLayoutGridDimensionMeasurement.LayoutGrid
        );
        // When toggle LayoutGrid->Px x dimension should be cleared
      } else if (width!.measurement === CElementDimensionMeasurement.Px) {
        x = new CElementDimension<CElementDimensionExtendMeasurement>(
          0,
          CElementDimensionMeasurement.Px
        );
      }
    }

    const height =
      dimensionSide === "height"
        ? new CElementDimension<CElementDimensionMeasurement>(
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
        transformation: new CElementTransformation(x, undefined, width, height),
        needChildrenToParentSync: true
      })
    );
  };

  private onCElementRemove = () => {
    const celId = this.state.currentCaelId!;
    store.dispatch(celementRemoveAction({ celId, withChildren: true }));
    store.dispatch(celementSelectAction({ celId: undefined }));
  };
}
