import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { dataProj, mapProj } from "../constants";
import { IDataLayer } from "./IDataLayer";


export class MPATrajectoryLayer implements IDataLayer {
    name = "";
    description = "";
    visible: boolean = false;
    layer: Layer<Source, LayerRenderer<any>>;
    updates = false;
    clickable = false;

    constructor() {
        this.layer = new WebGLLayer({
            visible: false,
            source: new VectorSource({ features: [] })
        })
    }

    public setVisible = (visible: boolean) => { this.layer.setVisible(visible); };

    public setSiteData(data?: any) {
        if (data != undefined) {
            const source = this.layer.getSource() as VectorSource;
            source.clear();
            const features = new GeoJSON().readFeatures(data, { dataProjection: dataProj, featureProjection: mapProj });
            // @ts-ignore
            source.addFeatures(features);
            this.layer.setVisible(true);
        }
    }

    public getLegend() {
        return undefined;
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
            },
        });
    }
}