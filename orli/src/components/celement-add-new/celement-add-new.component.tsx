import './celement-add-new.component.css';

import IconButton from "@mui/material/IconButton";
import React from "react";

import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import SquareOutlinedIcon from '@mui/icons-material/SquareOutlined';

class State {
  // celPosition: { x: number; y: number } = { x: 0, y: 0 };
  // celLayoutAligin = new CElementLayoutAlign();
}

export class CElementAddNewComponent extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = new State();
  }

  render() {
    return (
      <div className="add-new-wrapper">
        <IconButton aria-label="circle" size="large" className="new-cel cel-circle">
          <CircleOutlinedIcon />
        </IconButton>

        <IconButton aria-label="circle" size="large" className="new-cel cel-square">
          <SquareOutlinedIcon />
        </IconButton>
      </div>
    );
  }
}
