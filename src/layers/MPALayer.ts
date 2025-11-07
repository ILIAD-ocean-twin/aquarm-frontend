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
import { Feature } from "ol";
import chroma from 'chroma-js';


const colorScale = chroma.scale('OrRd').padding([0.25, 0.1]);;

export class MPALayer implements IDataLayer {
    name = "Protected areas";
    description = "Marine protected areas (MPA).<br /><br />If you click on an MPA, other MPAs that are connected through currents will be highlighted.<br /><br />We also show some representative drift trajectories.<br /><br />Additional information about the MPA become visible below the map.";
    visible: boolean = true;
    layer: Layer<Source, LayerRenderer<any>>;
    updates = false;
    clickable = true;

    _url: string;
    _source: any;
    _initiated: boolean = false;
    _lookup: Record<string, Record<string, number>> = {};
    _connectivityMax: number = 0;

    selectedFeature = undefined;

    constructor(dataUrl: string) {
        this._url = dataUrl;
        this.layer = new VectorLayer({
            visible: false,
            style: MPA_STYLE
        });
        this.setVisible(true);
    }

    public setConnectivityLookup(lookup: Record<string, Record<string, number>>) {
        this._lookup = lookup;
    }

    public setConnectivityMax(maxValue: number) {
        this._connectivityMax = maxValue;
    }

    public featureClicked(feature: any) {
        this.selectedFeature = feature;
        // @ts-ignore 
        this.layer.setStyle(createStyleFunction(this.selectedFeature, this._lookup, this._connectivityMax));
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
        color: 'rgba(255, 165, 0, 0.35)',
    }),
    stroke: new Stroke({
        color: 'rgba(255, 165, 0, 0.6)',
        width: 1,
    }),
});

const MPA_STYLE_SELECTED = new Style({
    fill: new Fill({
        color: 'rgba(0, 208, 110, 0.8)',
    }),
    stroke: new Stroke({
        color: "#00D06E",
        width: 3,
    }),
});

const MPA_STYLE_HIDDEN = new Style({
    fill: new Fill({
        color: 'rgba(100, 90, 50, 0.1)',
    }),
    stroke: new Stroke({
        color: 'rgba(255, 165, 0, 0.1)',
        width: 1
    }),
});

function createStyleFunction(selected: any, connectivity: Record<string, Record<string, number>>, max: number) {
    if (selected == undefined) {
        return MPA_STYLE;
    }

    const selectedId = selected.get("site_id");
    const connections = connectivity[selectedId] ?? {};
    const connectedIds = Object.keys(connections);
    // const maxConnectivity = connectedIds.length ? Math.max(...Object.values(connections)) : 0;

    return function (feature: Feature): Style {
        const currentId = feature.get("site_id");
        if (currentId == selectedId) {
            return MPA_STYLE_SELECTED;
        } if (connectedIds.includes(currentId)) {
            return new Style({
                fill: new Fill({
                    color: colorScale(connections[currentId] / max).hex(),
                }),
                stroke: new Stroke({
                    color: colorScale(connections[currentId] / max).hex(),
                    width: 1
                }),
            });
        }

        return MPA_STYLE_HIDDEN;
    };
}
