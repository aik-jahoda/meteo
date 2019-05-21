import { gradientCount } from "./RainbowBar";

it("gradients including borders", () => {
  expect(gradientCount([[0, 0], [200, 4]], [0, 1, 2, 3, 4])).toEqual([
    { offset: 0, value: 0 },
    { offset: 25, value: 1 },
    { offset: 50, value: 2 },
    { offset: 75, value: 3 },
    { offset: 100, value: 4 }
  ]);
});

it("gradients excluding borders", () => {
  expect(gradientCount([[0, 1.5], [200, 3.5]], [0, 1, 2, 3, 4])).toEqual([
    { offset: 0, value: 1.5 },
    { offset: 25, value: 2 },
    { offset: 75, value: 3 },
    { offset: 100, value: 3.5 }
  ]);
});

it("gradients skip same middle", () => {
  expect(
    gradientCount(
      [[0, 0], [50, 1], [100, 1], [150, 1], [200, 2]],
      [0, 1, 2, 3, 4]
    )
  ).toEqual([
    { offset: 0, value: 0 },
    { offset: 25, value: 1 },
    { offset: 75, value: 1 },
    { offset: 100, value: 2 }
  ]);
});

it("gradients skip same begin", () => {
  expect(
    gradientCount(
      [[0, 0], [50, 0], [100, 0], [150, 1], [200, 2]],
      [0, 1, 2, 3, 4]
    )
  ).toEqual([
    { offset: 0, value: 0 },
    { offset: 50, value: 0 },
    { offset: 75, value: 1 },
    { offset: 100, value: 2 }
  ]);
});

it("gradients skip same end", () => {
  expect(
    gradientCount(
      [[0, 0], [50, 1], [100, 2], [150, 2], [200, 2]],
      [0, 1, 2, 3, 4]
    )
  ).toEqual([
    { offset: 0, value: 0 },
    { offset: 25, value: 1 },
    { offset: 50, value: 2 },
    { offset: 100, value: 2 }
  ]);
});
