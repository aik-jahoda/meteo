import { localExtreems, skipSame } from "./utils";

test("empty", () => {
  expect(localExtreems([], x => x)).toEqual([]);
});

test("simple", () => {
  expect(localExtreems([1], x => x)).toEqual([0]);
});

test("linear", () => {
  expect(localExtreems([1, 2, 3, 4, 5], x => x)).toEqual([0, 4]);
});

test("small positive", () => {
  expect(localExtreems([1, 2, 1], x => x)).toEqual([0, 1, 2]);
});

test("smal negative", () => {
  expect(localExtreems([1, -2, 1], x => x)).toEqual([0, 1, 2]);
});

test("regular positive", () => {
  expect(localExtreems([1, 2, 3, 4, 3, 2, 1], x => x)).toEqual([0, 3, 6]);
});

test("regular negative", () => {
  expect(localExtreems([1, 0, -1, -2, -1, 0, 1], x => x)).toEqual([0, 3, 6]);
});

test("positive and negative", () => {
  expect(localExtreems([-1, 0, 1, 0, -1, 0, 1], x => x)).toEqual([0, 2, 4, 6]);
});

test("positive triple stairs", () => {
  expect(localExtreems([0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3], x => x)).toEqual([
    1,
    10
  ]);
});

test("positive double stairs", () => {
  expect(localExtreems([0, 0, 1, 1, 2, 2, 3, 3], x => x)).toEqual([1, 7]);
});

test.skip("transform", () => {
  expect(localExtreems([[0, 1], [0, 2], [0, 1]], x => x[1])).toEqual([0, 1, 2]);
});

test("positive quad stairs", () => {
  expect(
    localExtreems([0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3], x => x)
  ).toEqual([2, 14]);
});

test("skip same - first", () => {
  expect(skipSame(0, [1, 2, 3], x => x, 0)).toEqual(1);
});

test("skip same - middle", () => {
  expect(skipSame(1, [1, 2, 3], x => x, 0)).toEqual(2);
});

test("skip same - last", () => {
  expect(skipSame(2, [1, 2, 3], x => x, 0)).toEqual(3);
});

test("skip same group - first", () => {
  expect(skipSame(0, [1, 1, 1, 2, 2, 2, 3, 3, 3], x => x, 0)).toEqual(3);
});

test("skip same group - middle", () => {
  expect(skipSame(3, [1, 1, 1, 2, 2, 2, 3, 3, 3], x => x, 0)).toEqual(6);
});

test("skip same group - last", () => {
  expect(skipSame(6, [1, 1, 1, 2, 2, 2, 3, 3, 3], x => x, 0)).toEqual(9);
});
