import WebGLPointsLayer from "ol/layer/WebGLPoints";
import { BasicWeek, Filters } from "./types";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { transform } from "ol/proj";

export class AquacultureSitesLayer {
    public layer: WebGLPointsLayer<VectorSource>;
    public style: any;

    constructor(filters: Filters) {
        this.style = {
            variables: {
                fallow: filters.fallow ? 1 : 0
            },
            filter:
                ['match',
                    ['var', 'fallow'],
                    1,
                    true,
                    ['!=', ['get', 'fallow'], 1],
                ],
            'circle-radius': [
                'case',
                ['==', ['get', 'selected'], 1],
                [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    5,
                    6,
                    15,
                    16,
                ],
                ['==', ['get', 'hover'], 1],
                [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    5,
                    4,
                    15,
                    13,
                ],
                [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    5,
                    1.75,
                    15,
                    8,
                ]
            ],
            'circle-stroke-color': [
                'match',
                ['get', 'fallow'],
                0,
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'lice'],
                    0,
                    "#00FF00",
                    0.5,
                    "#FF0000",
                ],
                "#777"
            ],
            'circle-stroke-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5,
                0.8,
                15,
                3.5,
            ],
            'circle-fill-color': [
                'match',
                ['get', 'fallow'],
                1,
                "#000",
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'rank'],
                    0,
                    "#FFF",
                    1,
                    "#000",
                ]
            ],
            'circle-opacity': [
                'case',
                ['==', ['get', 'selected'], 1],
                0.95,
                ['==', ['get', 'fallow'], 1],
                0.6,
                0.8
            ],
        };

        this.layer = new WebGLPointsLayer({
            source: this.getSource([]),
            style: this.style
        })
    }

    public updateSource(data: BasicWeek[]) {
        this.layer.getSource().clear();
        this.layer.getSource().addFeatures(this.getFeatures(data));
    }

    private getSource(data: BasicWeek[]) {
        return new VectorSource({
            features: this.getFeatures(data)
        })
    }

    private getFeatures(data: BasicWeek[]) {
        return data.map(dp => new Feature({
            siteId: dp.id,
            name: dp.name,
            lice: dp.lice,
            rank: dp.rank,
            fallow: dp.isFallow ? 1 : 0,
            lat: dp.lat,
            lon: dp.lon,
            geometry: new Point(
                transform([dp.lon, dp.lat], 'EPSG:4326', 'EPSG:3857')
            )
        }))
    }
}