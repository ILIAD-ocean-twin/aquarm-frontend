import { EChartsAutoSize } from "echarts-solid"
import { theme } from "./themes/theme"
import chroma from "chroma-js";

const spectral = chroma.scale('Spectral');

export const Windrose = (props: { data: number[][] }) => {
  const radialBins = ['Flau vind', 'Svak vind', 'Lett bris', 'Laber bris', 'Frisk bris', 'Liten kuling', 'Stiv kuling', 'Sterk kuling', 'Liten storm', 'Full storm', 'Sterk storm', 'Orkan'];
  const angleBins = ['V', 'NV', 'N', 'NØ', 'Ø', 'SØ', 'S', 'SV'];
  const colors = spectral.colors(radialBins.length);

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
    grid: {
      left: 0,
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
          color: colors[radialBins.length - idx - 1],
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

  // @ts-ignore
  return <EChartsAutoSize option={options} theme={theme} />
}