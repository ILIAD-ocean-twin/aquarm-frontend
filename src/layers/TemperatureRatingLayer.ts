import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { RAZZER_URL } from "../constants";


export class TemperatureRatingLayer implements IDataLayer {
  name = "Sea temperature rating";
  description = "Geographic scoring of suitability for fish farming (salmon) based on historical sea temperature.";
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;
  updates = false;

  constructor() {
    this.layer = new TileLayer({
      visible: false,
      opacity: 0.8,
    })
    fetch(RAZZER_URL + "/metadata/temperature")
      .then(resp => resp.json())
      .then(meta => {
        const url = RAZZER_URL + "/singleband/temperature/{z}/{x}/{y}.png?colormap=gnbu&stretch_range=[14873,68794]";
        this.layer.setSource(new XYZ({
          url
        }))
      })
  }

  public async setVisible(visible: boolean): Promise<void> {
    this.visible = visible;
    this.layer.setVisible(visible);
  }

  public getLegend(): HTMLElement {
    const img = document.createElement("img");
    img.src = "/temperature_rating_legend.png";
    return img;
  }
}
