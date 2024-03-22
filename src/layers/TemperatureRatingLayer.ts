import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";


export class TemperatureRatingLayer implements IDataLayer {
  name = "Sea temperature rating";
  description = "Geographic scoring of suitability for fish farming (salmon) based on historical sea temperature.";
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;

  constructor() {
    this.layer = new TileLayer({
      visible: false,
      opacity: 0.8,
    })
    fetch("http://localhost:8800/metadata/temperature")
      .then(resp => resp.json())
      .then(meta => {
        const url = "http://localhost:8800/singleband/temperature/{z}/{x}/{y}.png?colormap=spectral&stretch_range=[" + (meta.range[0]) + "," + (meta.range[1]) + "]";
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
