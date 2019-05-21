import React, { memo } from "react";
import { map } from "../symbols";
import moment from "moment";

const CloudChartImpl = (props: {
  top: number;
  heigh: number;
  data: [moment.Moment, { symbol: number }][];
  scale: d3.ScaleTime<number, number>;
  x: number;
}) => {
  const imageSize = (props.heigh / 2) * 1.3;
  console.log("render cloud", JSON.stringify(props));
  return (
    <g>
      {props.data.map((x, i) => {
        const top = props.top + (i % 2 ? 0 : props.heigh - imageSize);
        if (map[x[1].symbol] === undefined) {
          console.warn(`Symbol ${x[1]} not found`);
          return null;
        }
        return (
          <React.Fragment key={x[0].valueOf()}>
            <g
              transform={`translate(${props.scale(x[0]) -
                imageSize / 2} ${top})`}
            >
              {React.createElement(
                map[x[1].symbol],
                { width: imageSize },
                null
              )}
            </g>
            <circle
              cx={props.scale(x[0])}
              cy={top}
              r={1}
              fill="lime"
              data-date={x[0].toString()}
            />
          </React.Fragment>
        );
      })}
    </g>
  );
};

export const CloudChart = memo(CloudChartImpl);
