import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { RAZZER_URL } from "../constants";


export class ChloroLayer implements IDataLayer {
  name = "Chlorophyll";
  description = "Satellite based chlorophyll concentrations. From ...";
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;
  updates = false;

  constructor() {
    this.layer = new TileLayer({
      visible: false,
      opacity: 0.8,
    })
    fetch(RAZZER_URL + "/metadata/salinity")
      .then(resp => resp.json())
      .then(meta => {
        const url = RAZZER_URL + "/singleband/CHL/{z}/{x}/{y}.png?colormap=summer&stretch_range=[0.992,-0.63]";
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
