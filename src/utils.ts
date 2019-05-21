import moment from "moment";

const compare = (value1: number, value2: number, tolerance: number) =>
  Math.abs(value1 - value2) <= tolerance ? 0 : value1 - value2;

export function localExtreems<T>(
  array: T[],
  trasform: (item: T) => number,
  tolerance = 0
) {
  const extremes: number[] = [];

  enum Direction {
    up,
    down,
    unknown
  }

  if (array.length == 0) {
    return [];
  }

  if (array.length == 1) {
    return [0];
  }

  const getDirection = (value: number, nextValue: number) =>
    compare(value, nextValue, tolerance) === 0
      ? Direction.unknown
      : value > nextValue
      ? Direction.down
      : Direction.up;

  let i = 0;
  let skippedTo = 0;
  //let lastExtreme = array[0];
  let lastDirection = Direction.unknown; //  getDirection(trasform(array[0]), trasform(array[1]));

  do {
    skippedTo = skipSame(i, array, trasform, tolerance);

    if (array.length > skippedTo) {
      const direction = getDirection(
        trasform(array[i]),
        trasform(array[skippedTo])
      );

      if (direction !== lastDirection) {
        extremes.push(i + Math.floor((skippedTo - i) / 2));
        lastDirection = direction;
      }
    } else {
      extremes.push(i + Math.floor((skippedTo - i) / 2));
    }
    i = skippedTo;
    // if (
    //   lastExtreme !== array[i] &&
    //   direction !== lastDirection
    //   //||
    //   //skippedTo === array.length
    // ) {
    //   extremes.push(i + Math.floor((skippedTo - i) / 2));

    //   //lastExtreme = array[i];
    // }
    // i = skippedTo;
    // lastDirection = direction;
  } while (i < array.length);

  return extremes;
}

export function skipSame<T>(
  currentIndex: number,
  array: T[],
  trasform: (item: T) => number,
  tolerance: number
) {
  let i = currentIndex;
  do {
    i++;
  } while (
    i < array.length &&
    compare(trasform(array[i]), trasform(array[i - 1]), tolerance) === 0
  );
  return i;
}

export const getDateIntervals = (
  from: moment.Moment,
  to: moment.Moment,
  interval: { value: number; unit: moment.unitOfTime.DurationAs }
) => {
  const days: moment.Moment[] = [];
  let current = from.clone().startOf("day");
  do {
    if (current.isAfter(from)) {
      days.push(current.clone());
    }
    current.add(interval.value, interval.unit);
  } while (current.isBefore(to));
  return days;
};

export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;
