import * as d3 from "d3";
import React, { useState, memo, useMemo } from "react";
import styled from "styled-components";

const Bar = styled.rect<{ color: string }>`
  fill: ${({ color }) => color};
  stroke-width: 0;
`;

let gradientKeyIndex = 0;

export type ColorScale = d3.ScaleLinear<d3.ColorCommonInstance, string>;

export const gradientCount = (data: [number, number][], domain: number[]) => {
  const minPosition = data[0][0];
  const maxPosition = data[data.length - 1][0];
  const max = maxPosition - minPosition;

  const countOffset = (xValue: number) => {
    const cur = xValue - minPosition;

    return (cur / max) * 100;
  };

  const offsets: { offset: number; value: number }[] = [];

  let domainIndex = 0;
  for (const [index, value] of data.entries()) {
    if (index > 0) {
      const prevValue = data[index - 1];
      for (; value[1] > domain[domainIndex]; domainIndex++) {
        if (prevValue[1] < domain[domainIndex]) {
          const domainRelValue = domain[domainIndex] - prevValue[1];
          const currentRelValue = value[1] - prevValue[1];
          const domainOffsett =
            ((value[0] - prevValue[0]) * domainRelValue) / currentRelValue +
            prevValue[0];
          offsets.push({
            offset: countOffset(domainOffsett),
            value: domain[domainIndex]
          });
        }
      }
    }
    offsets.push({ offset: countOffset(value[0]), value: value[1] });
  }

  return offsets.filter((value, index, array) => {
    if (index > 0 && index < array.length - 1) {
      return !(
        value.value === array[index - 1].value &&
        value.value === array[index + 1].value
      );
    }
    return true;
  });
};

const RainbowBarImpl = (props: {
  top: number;
  left: number;
  heigh: number;
  width: number;
  data: [number, number][];
  colorScale: ColorScale;
}) => {
  const [gradientKey] = useState(() => {
    gradientKeyIndex += 1;
    return `RainbowBarGradient${gradientKeyIndex}`;
  });

  const gradients = useMemo(
    () => gradientCount(props.data, props.colorScale.domain()),
    [props.data, props.colorScale]
  );

  return (
    <g>
      <defs>
        <linearGradient id={gradientKey} x1="0%" y1="0%" x2="100%" y2="0%">
          {gradients.map(x => (
            <stop
              key={x.offset}
              offset={`${x.offset}%`}
              style={{ stopColor: props.colorScale(x.value), stopOpacity: 1 }}
            />
          ))}
        </linearGradient>
        })}
      </defs>
      <Bar
        x={props.left}
        y={props.top}
        width={props.width}
        height={props.heigh}
        color={`url(#${gradientKey})`}
      />
    </g>
  );
};

export const RainbowBar = memo(RainbowBarImpl);

const scaleTest = d3
  .scaleLinear<d3.ColorCommonInstance>()
  .domain([0, 1, 2])
  .range([d3.hsl("black"), d3.hsl("white"), d3.hsl("orange")])
  .interpolate(d3.interpolateCubehelix);

export const RainbowBarTest = () => {
  return (
    <RainbowBar
      top={190}
      left={0}
      data={[[0, 0], [200, 2]]}
      colorScale={scaleTest}
      width={200}
      heigh={20}
    />
  );
};
