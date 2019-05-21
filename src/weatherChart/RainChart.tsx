import React, { memo } from "react";
import * as d3 from "d3";
import { RainbowBar } from "./RainbowBar";

const scale = d3
  .scaleLinear<d3.ColorCommonInstance>()
  .domain([0, 0.1, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60])
  .range([
    d3.hsl(0, 0, 0, 0),
    d3.hsl(269, 100, 77),
    d3.hsl(269, 100, 21),
    d3.hsl(257, 100, 32),
    d3.hsl(240, 100, 49),
    d3.hsl(206, 100, 37),
    d3.hsl(120, 100, 31),
    d3.hsl(120, 100, 36),
    d3.hsl(105, 100, 42),
    d3.hsl(77, 100, 43),
    d3.hsl(58, 99, 44),
    d3.hsl(41, 99, 49),
    d3.hsl(31, 100, 49),
    d3.hsl(20, 100, 49),
    d3.hsl(0, 100, 49),
    d3.hsl(0, 97, 28),
    d3.hsl(0, 97, 10)
  ])
  .interpolate(d3.interpolateCubehelix);

const RainChartImpl = (props: {
  top: number;
  heigh: number;
  left: number;
  data: [Date, number][];
  scale: d3.ScaleTime<number, number>;
}) => {
  const data: [number, number][] = props.data.map(x => [
    props.scale(x[0]),
    x[1]!
  ]);
  return (
    <g>
      <RainbowBar
        data={data}
        top={props.top}
        left={props.left}
        width={data[data.length - 1][0] - data[0][0]}
        heigh={props.heigh}
        colorScale={scale}
      />
    </g>
  );
};

export const RainChart = memo(RainChartImpl);
