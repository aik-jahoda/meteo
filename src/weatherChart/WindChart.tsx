import * as d3 from "d3";
import React, { memo } from "react";
import { RainbowBar } from "./RainbowBar";

const scale = d3
  .scaleLinear<d3.ColorCommonInstance>()
  .domain([0, 1.5, 3, 4.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 25, 30])
  .range([
    d3.rgb(98, 113, 183),
    d3.rgb(60, 109, 163),
    d3.rgb(74, 148, 169),
    d3.rgb(74, 145, 148),
    d3.rgb(77, 141, 124),
    d3.rgb(76, 164, 76),
    d3.rgb(102, 163, 53),
    d3.rgb(161, 135, 63),
    d3.rgb(161, 108, 91),
    d3.rgb(140, 63, 91),
    d3.rgb(151, 75, 144),
    d3.rgb(95, 99, 159),
    d3.rgb(90, 135, 160)
  ])
  .interpolate(d3.interpolateCubehelix);

const WindChartImpl = (props: {
  top: number;
  heigh: number;
  left: number;
  data: [Date, number][];
  scale: d3.ScaleTime<number, number>;
}) => {
  const data: [number, number][] = props.data.map(x => [
    props.scale(x[0]),
    x[1]
  ]);

  return (
    <RainbowBar
      data={data}
      top={props.top}
      left={props.left}
      width={data[data.length - 1][0] - data[0][0]}
      heigh={props.heigh}
      colorScale={scale}
    />
  );
};

export const WindChart = memo(WindChartImpl);
