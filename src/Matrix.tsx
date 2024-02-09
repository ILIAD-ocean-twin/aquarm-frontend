import { EChartsAutoSize } from "echarts-solid"
import { theme } from "./components/themes/theme"


export const CorrelationMatrix = (props: { locations: number[], data: (number)[][] }) => {

    const mapped_data = props.data.flat().map((d, idx) => {
        return [idx % 3, Math.floor(idx / 3), d]
    })
    console.log(mapped_data)
    const options = {
        xAxis: {
            type: 'category',
            data: props.locations,
        },
        yAxis: {
            type: 'category',
            data: props.locations,
        },
        grid: {
            height: '50%',
            top: '10%',
        },
        visualMap: {
            min: 0,
            max: 10,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
        },
        series: {
            type: 'heatmap',
            data: mapped_data,
            barWidth: "95%",
            name: "Connectivity",
            stack: 'a',
            emphasis: {
                focus: 'series'
            }
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