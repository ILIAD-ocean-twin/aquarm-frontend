import { EChartsAutoSize } from "echarts-solid"
import { theme } from "./themes/theme"
import { BasicWeek, HistoricLiceData } from "../types"
import { Accessor, Component, createEffect, createSignal, on } from "solid-js"

export const mapLiceData = (lice_data: Record<string, HistoricLiceData[]>, sites: BasicWeek[]): any => {
  const names = sites.reduce((pre, cur) => { pre[cur.id] = cur.name; return pre; }, {})
  const locations: string[] = []
  const data: (number | null)[][] = []
  const timestamps = Object.values(lice_data)[0].map(d => `W${d.week}/${d.year}`);

  Object.keys(lice_data).forEach((location) => {
    locations.push(names[location]);
    data.push(lice_data[location].map(d => d.avgAdultFemaleLice));
  })

  return { locations, timestamps, data }
}

interface WeeklyLiceChartProps {
  liceData: Accessor<Record<string, HistoricLiceData[]>>,
  sites: BasicWeek[]
}

export const WeeklyLiceChart: Component<WeeklyLiceChartProps> = (props) => {
  const [options, setOptions] = createSignal<any>({
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
      splitline: { show: false },
      data: [],
      splitArea: { show: true }
    },
    series: [],
    legend: {
      show: true,
      right: 'right',
      data: []
    }
  })

  createEffect(on(props.liceData, ld => {
    const { locations, timestamps, data } = mapLiceData(ld, props.sites);
    setOptions({
      ...options(),
      xAxis: {
        type: 'category',
        data: timestamps
      },
      series: locations.map((location, idx) => (
        {
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          data: data[idx],
          name: location,
          emphasis: {
            focus: 'series'
          }
        }
      )),
      legend: {
        show: true,
        right: 0,
        data: locations
      }
    })
  }));

  return (
    <EChartsAutoSize
      //@ts-ignore
      option={options()}
      notMerge={true}
      theme={theme}
    />
  )
}