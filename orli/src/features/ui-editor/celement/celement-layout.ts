export enum LayoutAlign {
  AlignCenter = 1,
  AlignStart = 2,
  AliginEnd = 3,
  None = 4,
}

export enum LayoutOrientation {
  Vertical = 1,
  Horizontal = 2,
}

export enum LayoutDisplayMode {
  Absolute = 1,
  Flex = 2,
}

export class CElementLayoutAlign {
  displayMode = LayoutDisplayMode.Flex;

  vertical = LayoutAlign.AlignCenter;
  horizontal = LayoutAlign.AlignCenter;
}
