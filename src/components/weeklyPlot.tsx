import { EChartsAutoSize } from "echarts-solid"
import { theme } from "./themes/theme"

export interface HistoricLiceData {
    year: number,
    week: number,
    avgAdultFemaleLice: number | null,
    avgMobileLice: number | null,
    rank: number | null
}

const compare_historic_times = (a: HistoricLiceData, b: HistoricLiceData) => {
  if (a.year == b.year){
    return (a.week > b.week) ? 1 : -1
  }else{
    return (a.year > b.year) ? 1 : -1
  }
}

export const map_lice_data = (lice_data: Record<string, HistoricLiceData[]>): [string[], string[], (number | null)[][]] => {
  const locations: string[] = []
  const data: (number | null)[][] = []
  let timestamps: string[] = []
  
  Object.keys(lice_data).map((location) => {
    lice_data[location].sort(compare_historic_times)
    locations.push(location)
    timestamps = (lice_data[location].map((d) => {
      return `W${d.week}/${d.year}`
    }))

    data.push(lice_data[location].map((d) => {
        return d.rank
      }))
  })
  
  return [locations,timestamps, data]
}

export const WeekLineChart = (props: {locations: string[],timestamps: string[], data: (number | null)[][]}) => {

    const options = {
        xAxis: {
            type: 'category',
            data: props.timestamps,
            splitArea: {show:true}
          },
        yAxis: {
            type: 'value',
        },
        series: props.locations.map((location, idx) => {
            return (
                {
                type: 'line',
                data: props.data[idx],
                barWidth: "95%",
                name: location,
                stack: 'a',
                emphasis: {
                    focus: 'series'
                    }
                }
              )
        }),
        legend: {
            show: true,
            orient:"horsiontal",
            right: 'right',
            data: props.locations
        },
        tooltip: {
            show: true,
        }
        
    }

    return (
        <>
            <EChartsAutoSize
                //@ts-ignore
                option={options}
                theme={theme}
            />
        </>
    )
}