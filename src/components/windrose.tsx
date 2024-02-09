import { EChartsAutoSize } from "echarts-solid"
import { theme } from "./themes/theme"

export const Windrose = (props: { data: number[][] }) => {
    const radialBins = ['Flau vind', 'Svak vind', 'Lett bris', 'Laber bris', 'Frisk bris', 'Liten kuling', 'Stiv kuling', 'Sterk kuling', 'Liten storm', 'Full storm', 'Sterk storm', 'Orkan'];
    const angleBins = ['V', 'NV', 'N', 'NØ', 'Ø', 'SØ', 'S', 'SV'];

    const options = {
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
        polar: {
        },
        series: radialBins.map((radialbin, idx) => {
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
            data: radialBins
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