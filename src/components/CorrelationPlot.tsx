import { EChartsAutoSize } from "echarts-solid"
import { theme } from "./themes/theme"
import { BasicWeek, HistoricSiteData } from "../types"
import { Accessor, Component, createEffect, createSignal, on } from "solid-js"

const compare_historic_times = (a: HistoricSiteData, b: HistoricSiteData) => {
  if (a.year == b.year) {
    return (a.week > b.week) ? 1 : -1
  } else {
    return (a.year > b.year) ? 1 : -1
  }
}

export const mapLiceData = (lice_data: Record<string, HistoricSiteData[]>, sites: BasicWeek[]): any => {
  const names = sites.reduce((pre, cur) => { pre[cur.id] = cur.name; return pre; }, {})
  const locations: string[] = []
  const data: (number | null)[][] = []
  const timestamps = Object.values(lice_data)[0].map(d => `W${d.week}/${d.year}`);

  Object.keys(lice_data).forEach((location) => {
    lice_data[location].sort(compare_historic_times);
    locations.push(names[location]);
    data.push(lice_data[location].map(d => d.avgAdultFemaleLice));
  })

  return { locations, timestamps, data }
}

interface CorrelationChartProps {
  liceData: Accessor<Record<string, HistoricSiteData[]>>,
  sites: BasicWeek[]
}

export const CorrelationChart: Component<CorrelationChartProps> = (props) => {
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