import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { dataProj, mapProj } from "../constants";
import { IDataLayer } from "./IDataLayer";


export class TrajectoryLayer implements IDataLayer {
  name = "Trajectory simulations";
  description = "Simulated particle trajectories based on OpenDrift.";
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;

  _url: string;
  _source: any;
  _initiated: boolean = false;

  constructor(dataUrl?: string) {
    this._url = dataUrl ?? '/2023-03-30T12-trajectories-5.json';
    this.layer = new WebGLLayer({
      visible: false
    })
  }

  public async setVisible(visible: boolean): Promise<void> {
    if (visible && !this._initiated) {
      this._source = await this.getGeoJson()
        .then(data => new VectorSource({
          features: new GeoJSON().readFeatures(data, { dataProjection: dataProj, featureProjection: mapProj })
        }));
      this.layer.setSource(this._source);
      this._initiated = true;
    }
    this.visible = visible;
    this.layer.setVisible(visible);
  }

  public getLegend() {
    return undefined;
  }

  private async getGeoJson() {
    return fetch(this._url)
      .then(response => response.json())
  }
}

class WebGLLayer extends Layer {
  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {
      className: this.getClassName(),
      style: {
        'stroke-width': 2,
        'stroke-color': 'rgba(24,86,34,0.7)',
        'stroke-offset': 0,
      }
    });
  }
}