import WebGLPointsLayer from "ol/layer/WebGLPoints";
import { BasicWeek, Filters } from "./types";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import Map from 'ol/Map';
import { transform } from "ol/proj";

export class AquacultureSitesLayer {
    public layer: WebGLPointsLayer<VectorSource>;
    public style: any;
    public source: VectorSource;

    constructor(data: any, filters: Filters) {
        this.source = this.getSource(data);
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
            source: this.source,
            style: this.style
        })
    }

    public update(map: Map) {
        const newLayer = new WebGLPointsLayer({
            source: this.source,
            style: this.style
        });
        map.addLayer(newLayer);
        map.removeLayer(this.layer);
        this.layer.dispose();
        this.layer = newLayer;
    }

    private getSource(data: BasicWeek[]) {
        return new VectorSource({
            features: data.map(dp => new Feature({
                siteId: dp.id,
                lice: dp.lice,
                rank: dp.rank,
                fallow: dp.isFallow ? 1 : 0,
                geometry: new Point(
                    transform([dp.lon, dp.lat], 'EPSG:4326', 'EPSG:3857')
                )
            }))
        })
    }
}