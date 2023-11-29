"use client";
import React from "react";
import { Chart } from "react-google-charts";
import "chart.js/auto";

const chart = () => {
  const options = {
    title: "Age vs. Weight comparison",
    hAxis: { title: "Age", viewWindow: { min: 0, max: 15 } },
    vAxis: { title: "Weight", viewWindow: { min: 0, max: 15 } },
    legend: "none",
  };
  console.log("options", options);
  const data = [
    ["Age", "Weight"],
    [8, 12],
    [4, 5.5],
    [11, 14],
    [4, 5],
    [3, 3.5],
    [6.5, 7],
  ];
  console.log("object", data);
  return (
    <div>
      <Chart
        chartType="ScatterChart"
        data={data}
        options={options}
        width="80%"
        height="400px"
        legendToggle
      />
    </div>
  );
};

export default chart;
