import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { dataProj, mapProj } from "../constants";
import { IDataLayer } from "./IDataLayer";


export class WeatherWarningLayer implements IDataLayer {
  name = "Weather warnings";
  description = "Current weather warnings from <a href='https://www.met.no/en'>MET Norway</a>.";
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;
  updates = false;

  _url: string;
  _source: any;
  _initiated: boolean = false;

  constructor(dataUrl?: string) {
    let style = WEATHER_WARNING_STYLE;
    this._url = dataUrl ?? 'https://api.met.no/weatherapi/metalerts/1.1/.json';
    this.layer = new VectorLayer({
      visible: false,
      style: (feature) => {
        style.setFill(new Fill({
          color: AWARENESS_LEVELS[feature.get('awareness_level')]
        }))
        return style
      }
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


const WEATHER_WARNING_STYLE = new Style({
  fill: new Fill({
    color: '#eeeeee',
  }),
  stroke: new Stroke({
    color: 'rgba(127, 127, 127, 0.3)',
    width: 1,
  }),
});

const AWARENESS_LEVELS = {
  '2; yellow; Moderate': 'rgba(255, 255, 0, 0.2)',
  '3; orange; Severe': 'rgba(255, 165, 0, 0.2)',
  '4; red; Extreme': 'rgba(255, 0, 0, 0.2)',
}