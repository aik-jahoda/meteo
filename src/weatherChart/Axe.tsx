import moment from "moment";
import React, { memo } from "react";
import styled from "styled-components";
import { getDateIntervals } from "../utils";

const Line = styled.line`
  stroke: ${({ theme }) => theme.backgroundContrastColor};
  stroke-width: 0.5;
`;

const Label = styled.text`
  font-size: 2rem;
`;

export const XAxeImpl = (props: {
  top: number;
  heigh: number;
  data: moment.Moment[];
  scale: d3.ScaleTime<number, number>;
}) => {
  const getLineLength = (time: moment.Moment) =>
    time.hours() === 0
      ? props.heigh * 0.5
      : time.hours() % 6 === 0
      ? props.heigh * 0.35
      : props.heigh * 0.2;
  return (
    <g>
      {getDateIntervals(props.data[0], props.data[props.data.length - 1], {
        value: 1,
        unit: "hour"
      }).map(x => (
        <Line
          key={x.valueOf()}
          y1={props.top}
          x1={props.scale(x)}
          y2={props.top + getLineLength(x)}
          x2={props.scale(x)}
        />
      ))}
      {getDateIntervals(props.data[0], props.data[props.data.length - 1], {
        value: 1,
        unit: "days"
      }).map(x => (
        <Label
          key={x.valueOf()}
          y={props.top + props.heigh * 0.35}
          x={props.scale(x)}
          dominantBaseline="hanging"
          fontSize={props.heigh * 0.65}
        >
          {moment(x).format("ddd")}
        </Label>
      ))}

      <Line
        y1={props.top}
        x1={props.scale(props.data[0])}
        y2={props.top}
        x2={props.scale(props.data[props.data.length - 1])}
      />
    </g>
  );
};

export const XAxe = memo(XAxeImpl);
