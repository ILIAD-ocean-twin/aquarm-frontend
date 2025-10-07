import TileLayer from "ol/layer/Tile";
import WMTS from 'ol/source/WMTS';
import Layer from "ol/layer/Layer";
import { optionsFromCapabilities } from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";


export class HabitatSuitabilityLayer implements IDataLayer {
    name = "Habitat suitability";
    description = `Habitat suitability from <a href='https://ows.emodnet.eu/geoserver/web/?0'>EMODnet</a>.`;
    visible: boolean = false;
    layer: Layer<Source, LayerRenderer<any>>;
    updates = true;

    _source: any;
    _initiated: boolean = false;
    _date: string;
    _capabilities: {};

    constructor(date: string) {
        this._date = date;
        this.layer = new TileLayer({
            visible: false,
            opacity: 0.5
        });
    }

    public async setVisible(visible: boolean): Promise<void> {
        if (visible && !this._initiated) {
            this.getCapabilities()
                .then(c => this._capabilities = c)
                .then(() => {
                    this._initiated = true;
                    this.update({ date: this._date });
                });
        }
        this.visible = visible;
        this.layer.setVisible(visible);
    }

    public update(params: { date: string }): void {
        this._date = params.date;
        if (this._initiated) {
            const source = this.getSuitabilitySource(params.date);
            this.layer.setSource(source);
        }
    }

    public getLegend(): HTMLElement {
        return undefined;
        // const img = document.createElement("img");
        // img.src = "/sea_temperature_legend.png";
        // return img;
    }

    private getSuitabilitySource(date: string): Source {
        const options = optionsFromCapabilities(this._capabilities, {
            layer: 'biology:occurrence_probability_fish',
            matrixSet: 'EPSG:4326',
        });

        options.dimensions.time = `${date}T00:00:00.000Z`;

        console.log(options);

        return new WMTS({
            ...options,
            attributions: "Habitat suitability from <a href='https://ows.emodnet.eu/geoserver/web/?0'>EMODnet</a>"
        });
    }

    private async getCapabilities(): Promise<{}> {
        return fetch('https://ows.emodnet.eu/geoserver/gwc/service/wmts?service=WMTS&acceptVersions=1.0.0&request=GetCapabilities')
            .then(response => response.text())
            .then(text => {
                const parser = new WMTSCapabilities();
                return parser.read(text);
            });
    }
}
