import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { dataProj, mapProj } from "./constants";


const awareness_levels = {
    '2; yellow; Moderate': 'rgba(255, 255, 0, 0.2)',
    '3; orange; Severe': 'rgba(255, 165, 0, 0.2)',
    '4; red; Extreme': 'rgba(255, 0, 0, 0.2)',
}

const geoJsonConsumer = async () => fetch('https://api.met.no/weatherapi/metalerts/1.1/.json')
    .then(response => response.json())

const style = new Style({
    fill: new Fill({
        color: '#eeeeee',
    }),
    stroke: new Stroke({
        color: 'rgba(127, 127, 127, 0.3)',
        width: 1,
    }),
});

export const getRiskLayer = (visible: boolean) => {
    let weatherRiskSource;
    return geoJsonConsumer()
        .then((data) => {
            weatherRiskSource = new VectorSource({
                features: new GeoJSON().readFeatures(data, { dataProjection: dataProj, featureProjection: mapProj })
            });

            return new VectorLayer({
                visible,
                source: weatherRiskSource,
                style: (feature) => {
                    style.setFill(new Fill({
                        color: awareness_levels[feature.get('awareness_level')]
                    }))
                    return style
                }
            });
        })
}
