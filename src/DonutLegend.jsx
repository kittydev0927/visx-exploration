import React from "react";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";

export default function DonutLegend({ width, height, data, animate = true }) {
  const color = (d) => d.color;

  const glyphSize = 20;

  const ordinalColorScale = scaleOrdinal({
    domain: data.map((c) => `${c.value}% ${c.label}`),
    range: data.map(color)
  });

  return (
    <div className="donut-legend" style={{ width, margin: "0 auto" }}>
      <LegendOrdinal
        scale={ordinalColorScale}
        // labelFormat={(label) => `${label.toUpperCase()}`}
        width={width}
        height={height}
      >
        {(labels) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {labels.map((label, i) => (
              <LegendItem
                key={`legend-quantile-${i}`}
                margin="5px 0"
                onClick={() => {
                  console.log(`clicked: ${JSON.stringify(label)}`);
                }}
              >
                <svg width={glyphSize} height={glyphSize}>
                  <circle
                    cx={glyphSize / 2}
                    cy={glyphSize / 2}
                    r={glyphSize / 4}
                    stroke={label.value}
                    strokeWidth="3px"
                    width={glyphSize}
                    height={glyphSize}
                    fill="none"
                  />
                </svg>
                <LegendLabel align="left" margin="0 0 0 4px">
                  {label.text}
                </LegendLabel>
              </LegendItem>
            ))}
          </div>
        )}
      </LegendOrdinal>
    </div>
  );
}
