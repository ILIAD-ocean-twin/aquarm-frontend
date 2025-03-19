import Layer from "ol/layer/Layer"

export interface IDataLayer {
  name: string
  description: string
  layer: Layer
  visible: boolean
  setVisible: (visible: boolean) => void
  updates: boolean
  update?: (year: number, week: number) => void
  getLegend: () => HTMLElement | undefined
}