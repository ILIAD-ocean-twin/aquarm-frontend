import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { dataProj, mapProj } from "./constants";

const geoJsonConsumer = async () => fetch('/production_areas.geojson')
    .then(response => response.json())

const style = new Style({
    fill: new Fill({
        color: 'rgba(127, 127, 127, 0.1)',
    }),
    stroke: new Stroke({
        color: 'rgba(127, 127, 127, 0.3)',
        width: 1,
    }),
});

export const getProductionAreaLayer = () => {
    let paSource;
    return geoJsonConsumer()
        .then((data) => {
            paSource = new VectorSource({
                features: new GeoJSON().readFeatures(data, { dataProjection: dataProj, featureProjection: mapProj })
            });

            return new VectorLayer({
                visible: false,
                source: paSource,
                style
            });
        })
}
