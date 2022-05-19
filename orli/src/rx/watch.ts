var getValue = require("object-path").get;

function defaultCompare(a: any, b: any) {
  return a === b;
}

export function watch<Slice>(getState: () => Slice, objectPath?: any, compare?: (a: any, b: any) => boolean) {
  compare ??= defaultCompare;
  var currentValue: Slice = getValue(getState(), objectPath);
  return function w(fn: (newValue: Slice, oldValue: Slice, objectPath: any) => any) {
    return function () {
      var newValue: Slice = getValue(getState(), objectPath);
      if (!compare!(currentValue, newValue)) {
        var oldValue = currentValue;
        currentValue = newValue;
        fn(newValue, oldValue, objectPath);
      }
    };
  };
}
