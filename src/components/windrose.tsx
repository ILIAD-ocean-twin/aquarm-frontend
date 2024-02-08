import { ECharts } from "echarts-solid"

export const Windrose = (props: { angleBins: string[], radialBins: string[], data: number[][] }) => {
    const options = {
        angleAxis: {
            type: 'category',
            startAngle: 90 + 360 / (2 * props.angleBins.length),
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
                    barWidth: "95%",
                    stack: 'a',
                    emphasis: {
                        focus: 'series'
                    }
                }
            )
        }),
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

    return <ECharts
        //@ts-ignore
        option={options}
        width={600}
        height={400}
    />
}