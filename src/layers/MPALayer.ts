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
import { FeatureLike } from "ol/Feature";

export class MPALayer implements IDataLayer {
    name = "Protected areas";
    description = "ProtectedSeas® Navigator GIS layers are provided on the Ocean Data Platform under the license CC-BY-4.0.";
    visible: boolean = false;
    layer: Layer<Source, LayerRenderer<any>>;
    updates = false;
    clickable = true;

    _url: string;
    _source: any;
    _initiated: boolean = false;

    selectedFeatures = [];

    constructor(dataUrl: string) {
        this._url = dataUrl;
        this.layer = new VectorLayer({
            visible: false,
            style: MPA_STYLE
        })
    }

    public featuresClicked(features: any[]) {
        this.selectedFeatures.forEach(f => deselect(f))
        this.selectedFeatures = features;
        this.selectedFeatures.forEach(f => select(f))
    }

    public async setVisible(visible: boolean): Promise<void> {
        if (visible && !this._initiated) {
            this._source = await this.getGeoJson()
                .then(data => {
                    data["features"].forEach(f => {
                        f["properties"]["layerName"] = this.name;
                    });
                    return new VectorSource({
                        features: new GeoJSON().readFeatures(data, { dataProjection: dataProj, featureProjection: mapProj }),
                        attributions: 'ProtectedSeas® Navigator GIS layers are provided on the Ocean Data Platform under the license CC-BY-4.0.'
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
}

const MPA_STYLE = new Style({
    fill: new Fill({
        color: 'rgba(127, 200, 220, 0.35)',
    }),
    stroke: new Stroke({
        color: 'rgba(0, 208, 110, 0.6)',
        width: 1,
    }),
});

const MPA_STYLE_SELECTED = new Style({
    fill: new Fill({
        color: 'rgba(127, 230, 220, 0.8)',
    }),
    stroke: new Stroke({
        color: "#00D06E",
        width: 3,
    }),
});

function deselect(f): void {
    f.setStyle(MPA_STYLE);
}

function select(f): void {
    f.setStyle(MPA_STYLE_SELECTED);
}