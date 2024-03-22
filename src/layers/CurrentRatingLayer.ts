import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";


export class CurrentRatingLayer implements IDataLayer {
  name = "Sea currents rating";
  description = "Geographic scoring of suitability for fish farming (salmon) based on historical sea current strengths.";
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;

  constructor() {
    this.layer = new TileLayer({
      visible: false,
      opacity: 0.8,
    })
    fetch("http://localhost:8800/metadata/current")
      .then(resp => resp.json())
      .then(meta => {
        const url = "http://localhost:8800/singleband/current/{z}/{x}/{y}.png?colormap=spectral&stretch_range=[" + meta.range[0] + "," + (meta.range[1]) + "]";
        console.log(url);

        this.layer.setSource(new XYZ({
          url
        }))
      })
  }

  public async setVisible(visible: boolean): Promise<void> {
    this.visible = visible;
    this.layer.setVisible(visible);
  }

  public getLegend() {
    return undefined;
  }
}
