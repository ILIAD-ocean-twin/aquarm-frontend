import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { LineChart as EchartsLineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { theme } from "./themes/theme";
import { Accessor, Component, createEffect, on, onMount } from "solid-js";

echarts.use([GridComponent, LegendComponent, EchartsLineChart, TooltipComponent, CanvasRenderer, UniversalTransition]);
echarts.registerTheme('default', theme);

interface WeeklyLiceChartProps {
  data: Accessor<{ series: { data: number[], name: string }[], ticks: string[] }>,
}

export const LineChart: Component<WeeklyLiceChartProps> = (props) => {
  let chartDom: HTMLDivElement;
  let sizeObserver: ResizeObserver;
  let chart: echarts.ECharts;

  onMount(() => {
    chart = echarts.init(chartDom, 'default');
    sizeObserver = new ResizeObserver(() => chart.resize());
    sizeObserver.observe(chartDom);
    chart.setOption(CHART_OPTIONS);
  });

  createEffect(on(props.data, (d) => {
    if (!d)
      return;

    const options = {
      ...CHART_OPTIONS,
      xAxis: {
        type: 'category',
        data: d.ticks
      },
      legend: {
        show: true,
        right: 0,
        data: d.series.map(s => s.name)
      },
      series: d.series
    }

    if (chart) {
      chart.setOption(options, true);
    }
  }))

  return <div ref={chartDom} class="w-full h-96" />
}

const CHART_OPTIONS = {
  animation: false,
  grid: {
    left: 32,
    top: 25,
    right: 18
  },
  yAxis: {
    type: 'value',
  },
  tooltip: {
    trigger: 'axis',
    show: true,
  },
  xAxis: {
    type: 'category',
    data: []
  },
  series: [],
  legend: {
    show: true,
    right: 0,
    data: []
  }
};