import { EChartsAutoSize } from "echarts-solid"
import { theme } from "./themes/theme"

import chroma from "chroma-js";

const spectral = chroma.scale('Spectral');

export const Radar = (props: { data: any }) => {
    const indicators = ['Temperature', 'Current', 'Salinity', 'Wind']
    const colors = spectral.colors(indicators.length);

    const option = {
        radar: {
            shape: 'circle',
            indicator: indicators.map((indicator, idx) => ({ name: indicator, max: 100, })),
        },
        tooltip: {
            show: true
        },
        series: [
            {
                name: 'Iliad Ranker',
                type: 'radar',
                data: [
                    {
                        textStyle: {
                            fontFamily: 'monospace',
                            fontSize: 16
                        },
                        marker: {
                            show: true
                        },
                        value: [...props.data, 50,],
                        name: 'Discomfort Rating',
                        color: colors[0],
                        emphasis: {
                            focus: 'series'
                        },
                        label: {
                            show: true,
                            formatter: function (params) {
                                return params.value;
                            }
                        }
                    }
                ]
            }
        ]
    }

    return (
        <EChartsAutoSize
            //@ts-ignore
            option={option}
            theme={theme}
        />
    )
}
export default Radar;
