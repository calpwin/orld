import "./choose-media.component.css";

import React from "react";
import { IconButton } from "@mui/material";
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';

class State {}

export class ChooseMediaComponent extends React.Component<{}, State> {
  render() {
    return (
      <div id="choose-media-wrapper">
        <IconButton aria-label="mobile" className="btn btn-mobile">
          <PhoneIphoneIcon />
        </IconButton>

        <IconButton aria-label="mobile" className="btn btn-tablet">
          <TabletMacIcon />
        </IconButton>

        <IconButton aria-label="mobile" className="btn btn-laptop">
          <LaptopMacIcon />
        </IconButton>

        <IconButton aria-label="mobile" className="btn btn-desktop">
          <DesktopMacIcon />
        </IconButton>
      </div>
    );
  }
}
