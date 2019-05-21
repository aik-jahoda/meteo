import * as d3 from "d3";
import * as React from "react";
import styled from "styled-components";
import { localExtreems } from "../utils";
import { areaCurveFactory } from "./AreaCurveGenerator";
import { memo } from "react";

type Props = {
  data: {
    date: Date;
    temperature: number;
  }[];
  scale: d3.ScaleTime<number, number>;
  x: number;
  y: number;
  heigh: number;
  width: number;
};

const TemperatureArea = styled.path`
  fill: url(#TemperatureGradient) #447799;
`;

const Temperature = styled.path`
  fill: none;
  stroke: blue;
  stroke-width: 2;
`;

const GradientStopNegative = styled.stop`
  stop-color: blue;
`;
const GradientStopZero = styled.stop`
  stop-color: white;
`;
const GradientStopPositive = styled.stop`
  stop-color: orange;
`;

const TemperatureLine = styled.line<{ bold: boolean }>`
  stroke: ${({ theme }) => theme.backgroundContrastColor};
  stroke-width: ${({ bold }) => (bold ? 1 : 0.5)};
`;

const TemperatureLines = (props: {
  tempRangeLow: number;
  tempRangeHigh: number;
  scale: d3.ScaleLinear<number, number>;
  x: number;
  width: number;
}) => (
  <g>
    {d3.range(props.tempRangeLow / 2, props.tempRangeHigh / 2 + 1).map(x => (
      <TemperatureLine
        key={`tempLine${x}`}
        bold={x % 5 === 0}
        y1={props.scale(x * 2)}
        x1={props.x}
        y2={props.scale(x * 2)}
        x2={props.width}
      />
    ))}
  </g>
);

const TemperatureChartImpl = (props: Props) => {
  if (props.data.length === 0) {
    return null;
  }

  const data = props.data
    .filter(x => x.temperature)
    .map(x => [x.date, x.temperature] as [Date, number]);

  const minTemp = d3.min(data.map(x => x[1])) || 0;
  const maxTemp = d3.max(data.map(x => x[1])) || 0;

  const tempRangeLow = Math.ceil(minTemp / 2) * 2 - 2;
  const tempRangeHigh = Math.floor(maxTemp / 2) * 2 + 2;

  const chartTop = props.y;
  const chartHeight = props.heigh;

  const temperatureScale = d3
    .scaleLinear()
    .domain([tempRangeLow, tempRangeHigh])
    .range([chartHeight + chartTop, chartTop]);

  const temperatureGradientScale = d3
    .scaleLinear()
    .domain([-20, 20])
    .range([0, 100]);

  const lineGenerator = d3
    .line<[Date, number]>()
    .x(data => props.scale(data[0]))
    .y(data => temperatureScale(data[1]))
    .curve(d3.curveCatmullRom);

  const areaGenerator = d3
    .line<[Date, number]>()
    .x(data => props.scale(data[0]))
    .y(data => temperatureScale(data[1]))
    .curve(
      areaCurveFactory(temperatureScale(tempRangeLow), d3.curveCatmullRom)
    );

  const TempPoints = () => (
    <g>
      {data.map((x, i) => (
        <circle
          key={x[0].valueOf()}
          r="2"
          cx={props.scale(x[0])}
          cy={temperatureScale(x[1])}
        />
      ))}
    </g>
  );

  const TempLabelShadow = styled.text`
    font-size: 2em;
    stroke: ${({ theme }) => theme.backgroundColor};
    fill: ${({ theme }) => theme.backgroundColor};
  `;

  const TempLabel = styled.text`
    font-size: 2em;
    fill: ${({ theme }) => theme.defaultTextColor};
  `;

  const tempLabels = localExtreems(data, x => x[1], 0.5).map(x => (
    <React.Fragment key={data[x][0].valueOf()}>
      <TempLabelShadow
        x={props.scale(data[x][0])}
        y={temperatureScale(data[x][1])}
      >
        {data[x][1]}
      </TempLabelShadow>
      <TempLabel x={props.scale(data[x][0])} y={temperatureScale(data[x][1])}>
        {data[x][1]}
      </TempLabel>
    </React.Fragment>
  ));

  return (
    <g>
      <linearGradient
        id="TemperatureGradient"
        x2="0"
        y2={temperatureScale(5)}
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1={temperatureScale(-5)}
      >
        <GradientStopNegative offset={`${temperatureGradientScale(-20)}%`} />
        <GradientStopZero offset={`${temperatureGradientScale(0)}%`} />
        <GradientStopPositive offset={`${temperatureGradientScale(20)}%`} />
      </linearGradient>
      <TemperatureLines
        scale={temperatureScale}
        x={props.x}
        tempRangeHigh={tempRangeHigh}
        tempRangeLow={tempRangeLow}
        width={props.width}
      />
      <g>
        <TemperatureArea d={areaGenerator(data) || ""} />
        <Temperature d={lineGenerator(data) || ""} />
      </g>
      <TempPoints />
      <g>{tempLabels}</g>
    </g>
  );
};

export const TemperatureChart = memo(TemperatureChartImpl);
