import React, { useState, useRef } from "react";
import { Pie, Group } from "@visx/visx";
import {
  animated,
  useSpring,
  useChain,
  useTransition,
  interpolate,
  config
} from "react-spring";
import data from "./data.js";
import "./styles.css";

import DonutLegend from "./DonutLegend";

// Reduced Motion technique: https://github.com/pmndrs/react-spring/issues/811

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };
const total = (d) => d.value;

export default function Donut({
  width = 400,
  height = 400,
  margin = defaultMargin,
  animate = true
}) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const top = centerY + margin.top;
  const left = centerX + margin.left;

  const [selectedArc, setSelectedArc] = useState({});
  const [previousArc, setPreviousArc] = useState({});

  const handleClick = (currentArc, data) => {
    console.log("clicking!", data.value);
    setSelectedArc(data);

    // if (currentArc.value === data.value) {
    //   setPreviousArc(data);
    //   console.log("handle click: same?", currentArc.value, data.value);
    //   return;
    // }
  };

  return (
    <div className="Donut">
      <svg width={width} height={height}>
        <filter id="shadow">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="8"
            floodColor="#555"
            floodOpacity="0.5"
          />
        </filter>
        <Group top={top} left={left}>
          <Pie
            data={data}
            innerRadius={radius / 1.4}
            outerRadius={radius}
            pieValue={total}
            startAngle={0}
            endAngle={360}
            pieSortValues={() => 1}
          >
            {(pie) => (
              <AnimatedPie
                {...pie}
                animate={animate}
                getKey={(arc) => arc.data.label}
                onClickDatum={({ data }) =>
                  animate && handleClick(previousArc, data)
                }
              />
            )}
          </Pie>
          <AnimatedCircle
            animate={animate}
            radius={radius}
            previousPercentage={previousArc.value}
            percentage={selectedArc.value || 0}
          />
        </Group>
      </svg>

      <DonutLegend width={200} data={data} />
    </div>
  );
}

const fromLeaveTransition = () => ({
  startAngle: 0,
  endAngle: 0,
  opacity: 0
});

const enterUpdateTransition = ({ startAngle, endAngle }) => ({
  startAngle,
  endAngle,
  opacity: 1
});

const AnimatedPie = ({ animate, arcs, path, getKey, onClickDatum }) => {
  const transitions = useTransition(arcs, getKey, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    config: config.gentle
  });

  return (
    <>
      {transitions.map(({ item: arc, props, key }) => {
        return (
          <g key={key}>
            <animated.path
              // compute interpolated path d attribute from intermediate angle values
              d={interpolate(
                [props.startAngle, props.endAngle],
                (startAngle, endAngle) =>
                  path({
                    ...arc,
                    startAngle,
                    endAngle
                  })
              )}
              fill={arc.data.color}
              onClick={() => onClickDatum(arc)}
              onTouchStart={() => onClickDatum(arc)}
            />
          </g>
        );
      })}
    </>
  );
};

const AnimatedCircle = (props) => {
  const { animate, radius, percentage, previousPercentage } = props;

  console.log("Animated Circle:", percentage);
  const zoomRef = useRef();
  const counterRef = useRef();
  useChain([zoomRef, counterRef]);

  const counter = useSpring({
    number: percentage,
    from: { number: previousPercentage || 0 },
    ref: counterRef
  });

  const { size, opacity } = useSpring({
    from: { opacity: 0, size: radius / 2 },
    to: { opacity: 1, size: radius / 1.2 },
    config: { ...config.gentle, friction: 60 },
    ref: zoomRef
  });

  return (
    <Group>
      <animated.circle
        r={size}
        fill="#fff"
        style={{ opacity }}
        className="detail-container"
        filter="url(#shadow)"
      />
      <animated.text
        textAnchor="middle"
        dy="10"
        style={{ opacity: opacity, fontSize: "32px" }}
      >
        {animate
          ? counter.number.interpolate((val) => Math.floor(val) + "%")
          : `${percentage}%`}
      </animated.text>
    </Group>
  );
};
