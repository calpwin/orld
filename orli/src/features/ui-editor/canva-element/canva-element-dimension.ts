import {
  CElementDimension,
  CElementDimensionMeasurement,
} from "../celement/celement";

export class CanvaElementDimension extends CElementDimension {
  private _valueInPx: number;

  get valueInPx() {
    if (this.measurement === CElementDimensionMeasurement.Px) return this.value;

    return this._valueInPx;
  }

  /** If tou update valueInPx with percent measurment you should update value in percent by yourself 
   * with help of @see syncDimensionInPxWithParentDimensionRef
   */
  set valueInPx(value: number) {
    this._valueInPx = value;

    if (this.measurement === CElementDimensionMeasurement.Px) this.value = value;
  }

  constructor(
    value: number,
    valueInPx?: number,
    measurement: CElementDimensionMeasurement = CElementDimensionMeasurement.Px
  ) {
    super(value, valueInPx || measurement ? measurement : CElementDimensionMeasurement.Px);
    this._valueInPx = valueInPx ?? value;
  }

  /*
    Get current dimension in px (valueInPx) and sync with parent Canva Element dimension in px (valueInPx),
    setup value at the end.
    If current dimension in percent, get current valueInPx and calculate value in percent related to parent Canva Element valueInPx    
  */
  static syncDimensionWithParentDimensionRef(
    dimension: CanvaElementDimension,
    parentDimensionInPx: number
  ) {
    if (dimension.measurement === CElementDimensionMeasurement.Percent) {
      dimension.value = (100 * dimension.valueInPx) / parentDimensionInPx;
    } else if (dimension.measurement === CElementDimensionMeasurement.Px) {
        // dimension.value = dimension.valueInPx;
    } else {
        throw Error(`Current dimension measurment ${dimension.measurement} not supported`);
    }
  }
}
