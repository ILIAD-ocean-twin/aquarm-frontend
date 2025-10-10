import Layer from "ol/layer/Layer"

export interface IDataLayer {
  name: string
  description: string
  layer: Layer
  visible: boolean
  setVisible: (visible: boolean) => void
  updates: boolean
  update?: (params: { year?: number, week?: number, date?: string }) => void
  getLegend: () => HTMLElement | undefined
  clickable?: boolean
  featuresClicked?: (features: any[]) => void
}
