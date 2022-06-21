import "./celement-properties-indents.component.css";

import { Input, InputAdornment } from "@mui/material";
import React from "react";
import {
  CElementIndent,
  CElementIndents,
  CElementMarginDirection as CElementIndentDirection,
} from "../../features/ui-editor/celement/celement-margin";

import MarginTwoToneIcon from "@mui/icons-material/MarginTwoTone";
import PaddingTwoToneIcon from "@mui/icons-material/PaddingTwoTone";
import BorderTopIcon from "@mui/icons-material/BorderTop";
import BorderRightIcon from "@mui/icons-material/BorderRight";
import BorderBottomIcon from "@mui/icons-material/BorderBottom";
import BorderLeftIcon from "@mui/icons-material/BorderLeft";

import store from "../../rx/store";
import { celementTransformAction } from "../../features/ui-editor/celement/celemet.actions";
import { CElementTransformation } from "../../features/ui-editor/celement/celement";

class State {
  margins = new CElementIndents();
  paddings = new CElementIndents();
  showMargins = true;
  showPaddings = true;
}

export class CElementPropertiesIndentsComponent extends React.Component<
  { indents: State },
  State
> {
  constructor(props: { indents: State }) {
    super(props);

    this.state = props.indents;
  }

  render() {
    const margins = (
      <div className="indents indent-margins">
        <MarginTwoToneIcon className="prefix" fontSize="small" />

        <div className="inputs">
          <Input
            className="input indent-margin-top"
            type="number"
            startAdornment={
              <InputAdornment position="start">
                <BorderTopIcon fontSize="small" />
              </InputAdornment>
            }
            value={Math.round(this.state.margins.top.value)}
            onChange={(e) =>
              this.onCelementIndentChanged(
                new CElementIndent(
                  Number.parseInt(e.target.value),
                  CElementIndentDirection.Top
                ),
                "margin"
              )
            }
          />

          <Input
            className="input indent-margin-right"
            type="number"
            startAdornment={
              <InputAdornment position="start">
                <BorderRightIcon fontSize="small" />
              </InputAdornment>
            }
            value={Math.round(this.state.margins.right.value)}
            onChange={(e) =>
              this.onCelementIndentChanged(
                new CElementIndent(
                  Number.parseInt(e.target.value),
                  CElementIndentDirection.Right
                ),
                "margin"
              )
            }
          />

          <Input
            className="input indent-margin-bottom"
            type="number"
            startAdornment={
              <InputAdornment position="start">
                <BorderBottomIcon fontSize="small" />
              </InputAdornment>
            }
            value={Math.round(this.state.margins.bottom.value)}
            onChange={(e) =>
              this.onCelementIndentChanged(
                new CElementIndent(
                  Number.parseInt(e.target.value),
                  CElementIndentDirection.Bottom
                ),
                "margin"
              )
            }
          />

          <Input
            className="input indent-margin-left"
            type="number"
            startAdornment={
              <InputAdornment position="start">
                <BorderLeftIcon fontSize="small" />
              </InputAdornment>
            }
            value={Math.round(this.state.margins.left.value)}
            onChange={(e) =>
              this.onCelementIndentChanged(
                new CElementIndent(
                  Number.parseInt(e.target.value),
                  CElementIndentDirection.Left
                ),
                "margin"
              )
            }
          />
        </div>
      </div>
    );

    const paddings = (
      <div className="indents indent-paddings">
        <PaddingTwoToneIcon className="prefix" fontSize="small" />

        <div className="inputs">
          <Input
            className="input indent-padding-top"
            type="number"
            startAdornment={
              <InputAdornment position="start">
                <BorderTopIcon fontSize="small" />
              </InputAdornment>
            }
            value={Math.round(this.state.paddings.top.value)}
            onChange={(e) =>
              this.onCelementIndentChanged(
                new CElementIndent(
                  Number.parseInt(e.target.value),
                  CElementIndentDirection.Top
                ),
                "padding"
              )
            }
          />

          <Input
            className="input indent-padding-right"
            type="number"
            startAdornment={
              <InputAdornment position="start">
                <BorderRightIcon fontSize="small" />
              </InputAdornment>
            }
            value={Math.round(this.state.paddings.right.value)}
            onChange={(e) =>
              this.onCelementIndentChanged(
                new CElementIndent(
                  Number.parseInt(e.target.value),
                  CElementIndentDirection.Right
                ),
                "padding"
              )
            }
          />

          <Input
            className="input indent-padding-bottom"
            type="number"
            startAdornment={
              <InputAdornment position="start">
                <BorderBottomIcon fontSize="small" />
              </InputAdornment>
            }
            value={Math.round(this.state.paddings.bottom.value)}
            onChange={(e) =>
              this.onCelementIndentChanged(
                new CElementIndent(
                  Number.parseInt(e.target.value),
                  CElementIndentDirection.Bottom
                ),
                "padding"
              )
            }
          />

          <Input
            className="input indent-padding-left"
            type="number"
            startAdornment={
              <InputAdornment position="start">
                <BorderLeftIcon fontSize="small" />
              </InputAdornment>
            }
            value={Math.round(this.state.paddings.left.value)}
            onChange={(e) =>
              this.onCelementIndentChanged(
                new CElementIndent(
                  Number.parseInt(e.target.value),
                  CElementIndentDirection.Left
                ),
                "padding"
              )
            }
          />
        </div>
      </div>
    );

    return (
      <div id="properties-indent-wrapper">
        {this.state.showMargins && margins}

        {this.state.showPaddings && paddings}
      </div>
    );
  }

  private onCelementIndentChanged(
    indent: CElementIndent,
    indentType: "margin" | "padding"
  ) {
    store.dispatch(
      celementTransformAction({
        celId: store.getState().editor.currentSelectedCElementId!,
        transformation: new CElementTransformation(
          undefined,
          undefined,
          undefined,
          undefined,
          indent && indentType === "margin" ? [indent] : undefined,
          indent && indentType === "padding" ? [indent] : undefined
        ),
      })
    );
  }
}
