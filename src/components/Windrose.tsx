import * as echarts from 'echarts/core';
import {
  TitleComponent,
  LegendComponent,
  PolarComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import chroma from "chroma-js";
import { Component, onMount } from 'solid-js';

echarts.use([TitleComponent, LegendComponent, BarChart, PolarComponent, CanvasRenderer]);
const spectral = chroma.scale('Spectral');

export const Windrose: Component<{ data: number[][] }> = (props) => {

  let chartDom: HTMLDivElement;
  let sizeObserver: ResizeObserver;
  let chart: echarts.ECharts;

  const options = {
    ...CHART_OPTIONS,
    series: radialBins.map((radialbin, idx) => {
      return (
        {
          type: "bar",
          data: props.data[idx],
          coordinateSystem: 'polar',
          name: radialbin,
          color: colors[radialBins.length - idx - 1],
          barWidth: "100%",
          stack: 'a',
          emphasis: {
            focus: 'series'
          }
        }
      )
    })
  }

  onMount(() => {
    chart = echarts.init(chartDom, 'default');
    chart.setOption(options);
    sizeObserver = new ResizeObserver(() => chart.resize());
    sizeObserver.observe(chartDom);
  });

  return <div ref={chartDom} class="w-full h-96" />
}

const radialBins = ['Flau vind', 'Svak vind', 'Lett bris', 'Laber bris', 'Frisk bris', 'Liten kuling', 'Stiv kuling', 'Sterk kuling', 'Liten storm', 'Full storm', 'Sterk storm', 'Orkan'];
const angleBins = ['V', 'NV', 'N', 'NØ', 'Ø', 'SØ', 'S', 'SV'];
const colors = spectral.colors(radialBins.length);

const CHART_OPTIONS = {
  angleAxis: {
    type: 'category',
    startAngle: 180 + 360 / (2 * angleBins.length),
    data: angleBins,
    splitArea: { show: true },
  },
  radiusAxis: {
    axisLabel: { show: false },
    axisPointer: { show: false },
    axisLine: { show: false }
  },
  grid: {
    left: 0,
  },
  polar: {
  },
  series: [],
  legend: {
    show: true,
    orient: "vertical",
    right: 'right',
    data: radialBins
  },
  tooltip: {
    show: true,
  }
}