import "./choose-media.component.css";

import React from "react";
import { IconButton } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import DesktopMacIcon from "@mui/icons-material/DesktopMac";
import { EditorMediaType } from "../../features/ui-editor/editor/editor-media-type";
import store from "../../rx/store";
import { editorChangeMediaAction } from "../../features/ui-editor/editor/editor.actions";
import { lastEditorMediaSelector } from "../../features/ui-editor/editor/editor.selectors";
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import { watch } from "../../rx/watch";

class State {
  media!: EditorMediaType;
}

export class ChooseMediaComponent extends React.Component<{}, State> {
  private isComponentEventsBind: any;

  constructor(props: any) {
    super(props);

    this.state = new State();
  }

  componentDidMount() {
    this.bindEventListeners();
  }

  render() {
    return (
      <div id="choose-media-wrapper">
        <IconButton
          aria-label="mobile"
          className={this.state.media === EditorMediaType.Phone ? 'btn btn-mobile selected' : 'btn btn-mobile'}
          onClick={() => this.onChooseMediaBtnClicked(EditorMediaType.Phone)}          
        >
          <PhoneIphoneIcon />
        </IconButton>

        <IconButton
          aria-label="tablet"          
          className={this.state.media === EditorMediaType.Tablet ? 'btn btn-tablet selected' : 'btn btn-tablet'}
          onClick={() => this.onChooseMediaBtnClicked(EditorMediaType.Tablet)}
        >
          <TabletMacIcon />
        </IconButton>

        <IconButton
          aria-label="laptop"
          className={this.state.media === EditorMediaType.Laptop ? 'btn btn-laptop selected' : 'btn btn-laptop'}
          onClick={() => this.onChooseMediaBtnClicked(EditorMediaType.Laptop)}
        >
          <LaptopMacIcon />
        </IconButton>

        <IconButton
          aria-label="desktop"
          className={this.state.media === EditorMediaType.Desktop ? 'btn btn-desktop selected' : 'btn btn-desktop'}
          onClick={() => this.onChooseMediaBtnClicked(EditorMediaType.Desktop)}
        >
          <DesktopMacIcon />
        </IconButton>

        <IconButton
          aria-label="default"
          className={this.state.media === EditorMediaType.Default ? 'btn btn-default selected' : 'btn btn-default'}
          onClick={() => this.onChooseMediaBtnClicked(EditorMediaType.Default)}
        >
          <ScreenshotMonitorIcon />
        </IconButton>
      </div>
    );
  }

  private bindEventListeners() {
    if (this.isComponentEventsBind) return;

    const wlastEditorMedia = watch(() =>
      lastEditorMediaSelector(store.getState().editor)
    );
    store.subscribe(wlastEditorMedia((newMedia, oldMedia) => {
      this.setState({...this.state, media: newMedia});
    }));

    this.isComponentEventsBind = true;
  }

  private onChooseMediaBtnClicked = (media: EditorMediaType) => {
    store.dispatch(editorChangeMediaAction({ media }));
  };
}
