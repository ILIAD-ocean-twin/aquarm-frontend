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

export class MPALayer implements IDataLayer {
    name = "Protected areas";
    description = "ProtectedSeas® Navigator GIS layers are provided on the Ocean Data Platform under the license CC-BY-4.0.";
    visible: boolean = false;
    layer: Layer<Source, LayerRenderer<any>>;
    updates = false;

    _url: string;
    _source: any;
    _initiated: boolean = false;

    constructor(dataUrl?: string) {
        this._url = dataUrl ?? '/kommuner_2024.json';
        this.layer = new VectorLayer({
            visible: false,
            style: MUNICIPALITY_STYLE
        })
    }

    public async setVisible(visible: boolean): Promise<void> {
        if (visible && !this._initiated) {
            this._source = await this.getGeoJson()
                .then(data => new VectorSource({
                    features: new GeoJSON().readFeatures(data, { dataProjection: dataProj, featureProjection: mapProj }),
                    attributions: 'ProtectedSeas® Navigator GIS layers are provided on the Ocean Data Platform under the license CC-BY-4.0.'
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

const MUNICIPALITY_STYLE = new Style({
    fill: new Fill({
        color: 'rgba(127, 160, 220, 0.075)',
    }),
    stroke: new Stroke({
        color: 'rgba(127, 127, 127, 0.3)',
        width: 1,
    }),
});