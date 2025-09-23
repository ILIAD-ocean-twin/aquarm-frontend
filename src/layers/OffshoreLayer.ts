import chroma from "chroma-js";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import Fill from 'ol/style/Fill';
import RegularShape from 'ol/style/RegularShape';
import { dataProj, mapProj } from "../constants";
import { IDataLayer } from "./IDataLayer";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import { BasicWeek } from "../types";
import { FeatureLike } from "ol/Feature";


export class OffshoreLayer implements IDataLayer {
  name = "Offshore installations";
  description = "....";
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;
  updates = false;

  _url: string;
  _source: any;
  _initiated: boolean = false;

  _connections: any;
  _features: Array<FeatureLike>;
  _platforms = {}
  _sites = {}

  constructor(dataUrl?: string) {
    this._url = dataUrl ?? '/platforms_norway.json';
    this.layer = new VectorLayer({
      visible: false,
      style: styleFunction
    })
  }

  public async setVisible(visible: boolean): Promise<void> {
    if (visible && !this._initiated) {
      this._connections = await this.getConnections();
      this._source = await this.getGeoJson()
        .then(data => {
          data["features"].forEach(f => this._platforms[f["properties"]["platform_id"]] = f["geometry"]["coordinates"]);

          this._connections.forEach(c => {
            const p = this._platforms[c["from_CODE"]];
            const aq = this._sites[c["to_localityId"]];
            if (p && aq) {
              data["features"].push({
                'type': 'Feature',
                'geometry': {
                  'type': 'LineString',
                  'coordinates': [
                    p,
                    aq
                  ],
                },
                'properties': {
                  'count': c["count"],
                  'median_impact_parameter_in_m': c['median_impact_parameter_in_m']
                }
              })
            }
          })
          this._features = new GeoJSON().readFeatures(data, { dataProjection: dataProj, featureProjection: mapProj });
          return new VectorSource({
            features: this._features
          })
        });
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

  private async getConnections() {
    return fetch("/aq_connections.json")
      .then(response => response.json())
  }

  public setData(data: BasicWeek[]) {
    data.forEach(bw => this._sites[bw.id] = [bw.lon, bw.lat]);
  }
}

const scale = chroma.scale('Spectral').domain([50, 0]);

const triangle = new RegularShape({
  points: 3,
  radius: 6,
  fill: new Fill({
    color: 'purple',
  }),
  stroke: new Stroke({
    color: "white",
    width: 1,
  })
});

const styles = {
  'Point': new Style({
    image: triangle,
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  })
}

const styleFunction = function (feature) {
  const t = feature.getGeometry().getType()
  if (t == 'Point') {
    return styles["Point"];
  } else {
    styles["LineString"].setStroke(new Stroke({
      color: scale(feature.get("count")).hex(),
      width: 1,
    }));
    return styles["LineString"];
  }
};