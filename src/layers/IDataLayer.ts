import Layer from "ol/layer/Layer"

export interface IDataLayer {
  name: string
  description: string
  layer: Layer
  visible: boolean
  setVisible: (visible: boolean) => void
  update?: (year: number, week: number) => void
  getLegend: () => HTMLElement | undefined
}