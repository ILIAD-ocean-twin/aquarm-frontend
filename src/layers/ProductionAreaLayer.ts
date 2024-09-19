import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { dataProj, mapProj } from "../constants";
import { IDataLayer } from "./IDataLayer";
import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";


export class ProductionAreaLayer implements IDataLayer {
  name = "Production areas";
  description = `Production areas for fish farming in Norway as defined by 
                <a href='https://lovdata.no/dokument/SF/forskrift/2017-01-16-61/KAPITTEL_5#KAPITTEL_5)'>Lovdata</a>. 
                GeoJSON fetched from <a href='https://www.barentswatch.no/bwapi/openapi/index.html?urls.primaryName=Fishhealth%20API#/ProductionArea/get_v1_geodata_productionarea__productionAreaId___year___week_'>BarentsWatch</a>.`;
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;
  updates = false;

  _url: string;
  _source: any;
  _initiated: boolean = false;

  constructor(dataUrl?: string) {
    this._url = dataUrl ?? '/production_areas.geojson';
    this.layer = new VectorLayer({
      visible: false,
      style: PRODUCTION_AREA_STYLE
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

const PRODUCTION_AREA_STYLE = new Style({
  fill: new Fill({
    color: 'rgba(127, 127, 127, 0.1)',
  }),
  stroke: new Stroke({
    color: 'rgba(127, 127, 127, 0.3)',
    width: 1,
  }),
});