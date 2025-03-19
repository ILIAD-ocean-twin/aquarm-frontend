import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { RAZZER_URL } from "../constants";


export class AlgaeLayer implements IDataLayer {
  name = "Algae";
  description = `Satellite based algal concentrations. Sentinel-3 data from <a href='https://dataspace.copernicus.eu/'>Copernicus</a>.`;
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;
  updates = false;

  constructor() {
    this.layer = new TileLayer({
      visible: false,
      opacity: 0.8,
    })
    fetch(RAZZER_URL + "/metadata/CHL")
      .then(resp => resp.json())
      .then(meta => {
        const url = RAZZER_URL + "/singleband/CHL/{z}/{x}/{y}.png?colormap=ylgnbu&stretch_range=[0.1,-0.57]";
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
    img.src = "/algae_legend.png";
    return img;
  }
}
