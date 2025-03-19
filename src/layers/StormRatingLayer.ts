import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { RAZZER_URL } from "../constants";


export class StormRatingLayer implements IDataLayer {
  name = "Storm exposure";
  description = "Geographic scoring of storm susceptibility based on historical wind data.";
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;
  updates = false;

  constructor() {
    this.layer = new TileLayer({
      visible: false,
      opacity: 0.8,
    })
    fetch(RAZZER_URL + "/metadata/storm")
      .then(resp => resp.json())
      .then(meta => {
        const url = RAZZER_URL + "/singleband/storm/{z}/{x}/{y}.png?colormap=spectral&stretch_range=[" + (meta.range[1]) + "," + (meta.range[0]) + "]";
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
    img.src = "/storm_exposure_legend.png";
    return img;
  }
}
