import * as d3 from "d3";
import moment from "moment";
import React, { useState, useMemo, memo } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Data, Summary } from "../forecast/weather";
import { AppState } from "../store";
import { getDateIntervals } from "../utils";
import { XAxe } from "./Axe";
import { CloudChart } from "./CloudChart";
import { RainChart } from "./RainChart";
import { TemperatureChart } from "./TemperatureChart";
import { WindChart } from "./WindChart";

const mapStateToProps = (state: AppState) => ({
  forecast: state.forecast
});

type Props = ReturnType<typeof mapStateToProps>;

type isDefined = <T>(value: T | undefined) => value is T;
const isDefined: isDefined = (value => value !== undefined) as isDefined;

const DateLabel = styled.line<{ bold: boolean }>`
  stroke: ${({ theme }) => theme.backgroundContrastColor};
  stroke-width: ${({ bold }) => (bold ? 1 : 0.5)};
`;

const DateLabels = memo(
  (props: {
    top: number;
    heigh: number;
    data: Data[];
    scale: d3.ScaleTime<number, number>;
  }) => (
    <g>
      {getDateIntervals(
        props.data[0].to,
        props.data[props.data.length - 1].to,
        {
          value: 1,
          unit: "days"
        }
      ).map(x => (
        <DateLabel
          bold={x.hours() === 0}
          key={x.valueOf()}
          y1={props.top}
          x1={props.scale(x)}
          y2={props.top + props.heigh}
          x2={props.scale(x)}
        />
      ))}
    </g>
  )
);

const DateSeparatorNow = styled.line`
  stroke: red;
  stroke-width: 0.5;
`;

const Now = memo(
  (props: {
    top: number;
    heigh: number;
    position: Date;
    scale: d3.ScaleTime<number, number>;
  }) => (
    <DateSeparatorNow
      y1={props.top}
      x1={props.scale(props.position)}
      y2={props.top + props.heigh}
      x2={props.scale(props.position)}
    />
  )
);

const WeatherChartImpl = (props: Props) => {
  const data = props.forecast.weather;

  if (data.length === 0) {
    return null;
  }

  const svgHeight = 500;
  const svgWidth = 1400;

  const heightScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, svgHeight]);

  const chartLeft = 10;
  const chartWidth = svgWidth - 2 * chartLeft;

  const xDateScale = useMemo(
    () =>
      d3
        .scaleTime()
        .domain([data[0].to, data[data.length - 1].to])
        .range([chartLeft, chartWidth]),
    [chartLeft, chartWidth, data]
  );

  const [cursorState, setCursorState] = useState(new Date());

  const cloudChartPosition = {
    top: heightScale(0),
    heigh: heightScale(15),
    x: chartLeft
  };

  const tempChartPosition = {
    y: cloudChartPosition.heigh,
    heigh: heightScale(60),
    x: chartLeft
  };

  const rainChartPosition = {
    heigh: heightScale(5),
    top: tempChartPosition.y + tempChartPosition.heigh,
    left: chartLeft
  };

  const windChartPosition = {
    heigh: heightScale(5),
    top: rainChartPosition.top + rainChartPosition.heigh,
    left: chartLeft
  };

  const dateLaelsPosition = {
    top: cloudChartPosition.heigh,
    heigh: tempChartPosition.heigh + windChartPosition.heigh
  };

  const nowCursorPosition = dateLaelsPosition;

  const axePosition = {
    top: windChartPosition.top + windChartPosition.heigh,
    heigh: heightScale(10)
  };

  const preapreDuration = (
    action: (summary: Summary, data: Data) => boolean
  ) => {
    return data
      .map(x => {
        const duration = x.summary.find(summary => action(summary, x));
        if (duration) {
          const y: [
            moment.Moment,
            {
              duration: number;
              precipitation: number;
              symbol: number;
            }
          ] = [x.to, duration];
          return y;
        }
        return;
      })
      .filter(isDefined);
  };

  const preciseDurationData = preapreDuration(
    (summary, data) => summary.duration === (data.summary.length === 1 ? 6 : 1)
  );

  const longDurationData = React.useMemo(
    () =>
      preapreDuration(
        (summary, data) =>
          data.to.utc().hours() % 1 === 0 && summary.duration === 1
      ),
    [data]
  );

  const xAxeData = React.useMemo(() => data.map(x => x.to), [data]);
  const temperatureChartData = useMemo(
    () =>
      data.map(x => ({
        date: x.to.toDate(),
        temperature: x.temperature
      })),
    [data]
  );

  const windChartData = useMemo(
    () => data.map(x => [x.to.toDate(), x.windSpeed]) as [Date, number][],
    [data]
  );

  const rainChartData = useMemo(
    () =>
      preciseDurationData.map(x => [x[0].toDate(), x[1].precipitation]) as [
        Date,
        number
      ][],
    [preciseDurationData]
  );

  return (
    <>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        id="waveform"
        onMouseMove={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
          const date = xDateScale.invert(event.clientX);
          setCursorState(date);
        }}
        onMouseLeave={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
          setCursorState(new Date())
        }
      >
        <TemperatureChart
          data={temperatureChartData}
          scale={xDateScale}
          width={chartWidth}
          {...tempChartPosition}
        />

        <XAxe {...axePosition} data={xAxeData} scale={xDateScale} />
        <CloudChart
          {...cloudChartPosition}
          data={longDurationData}
          scale={xDateScale}
        />
        <RainChart
          {...rainChartPosition}
          data={rainChartData}
          scale={xDateScale}
        />
        <WindChart
          {...windChartPosition}
          data={windChartData}
          scale={xDateScale}
        />
        <DateLabels {...dateLaelsPosition} scale={xDateScale} data={data} />
        <Now position={cursorState} {...nowCursorPosition} scale={xDateScale} />
      </svg>
      {cursorState.toString()}
    </>
  );
};

export const WeatherChart = connect(mapStateToProps)(WeatherChartImpl);
