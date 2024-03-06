import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import Layer from "ol/layer/Layer";
import { dataProj, mapProj } from "../constants";

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

const geoJsonConsumer = async () => fetch('/2023-03-30T12-trajectories-5.json') //('/trajectory')
    .then(response => response.json())

export const getTrajectoryLayer = () => {
    let trajectorySource;
    return geoJsonConsumer()
        .then((data) => {
            trajectorySource = new VectorSource({
                features: new GeoJSON().readFeatures(data, { dataProjection: dataProj, featureProjection: mapProj })
            });

            return new WebGLLayer({
                visible: false,
                source: trajectorySource
            });
        })
}
