import { EChartsAutoSize } from "echarts-solid"
import { theme } from "./themes/theme"

export const Windrose = (props: { angleBins: string[], radialBins: string[], data: number[][] }) => {

    const options = {
        angleAxis: {
            type: 'category',
            startAngle: 180 + 360 / (2 * props.angleBins.length),
            data: props.angleBins,
            splitArea: { show: true },
        },
        radiusAxis: {
            axisLabel: { show: false },
            axisPointer: { show: false },
            axisLine: { show: false }
        },
        polar: {
        },
        series: props.radialBins.map((radialbin, idx) => {
            return (
                {
                    type: 'bar',
                    data: props.data[idx],
                    coordinateSystem: 'polar',
                    name: radialbin,
                    barWidth: "100%",
                    stack: 'a',
                    emphasis: {
                        focus: 'series'
                    }
                }
            )
        }
        ),
        legend: {
            show: true,
            orient: "vertical",
            right: 'right',
            data: props.radialBins
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