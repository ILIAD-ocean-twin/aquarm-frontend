import TileLayer from "ol/layer/Tile";
import WMTS from 'ol/source/WMTS';
import Layer from "ol/layer/Layer";
import { optionsFromCapabilities } from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";


export class MPALayer implements IDataLayer {
    name = "Marine protected areas";
    description = `Marine protected areas. Data from <a href='https://ows.emodnet-humanactivities.eu/geoserver/web/?0'>EMODnet Human Activities</a>.`;
    visible: boolean = false;
    layer: Layer<Source, LayerRenderer<any>>;
    updates = false;

    _source: any;
    _initiated: boolean = false;
    _date: string;
    _capabilities: {};

    constructor() {
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
                    this.update();
                });
        }
        this.visible = visible;
        this.layer.setVisible(visible);
    }

    public update(): void {
        if (this._initiated) {
            const source = this.getSource();
            this.layer.setSource(source);
        }
    }

    public getLegend(): HTMLElement {
        return undefined;
        // const img = document.createElement("img");
        // img.src = "/sea_temperature_legend.png";
        // return img;
    }

    private getSource(): Source {
        const options = optionsFromCapabilities(this._capabilities, {
            layer: 'emodnet:wdpaareas',
            matrixSet: 'EPSG:4326',
        });

        return new WMTS({
            ...options,
            attributions: "Marine protected areas from <a href='https://ows.emodnet-humanactivities.eu/geoserver/web/?0'>EMODnet Human Activities</a>"
        });
    }

    private async getCapabilities(): Promise<{}> {
        return fetch('https://ows.emodnet-humanactivities.eu/geoserver/gwc/service/wmts?service=WMTS&version=1.1.1&request=GetCapabilities')
            .then(response => response.text())
            .then(text => {
                const parser = new WMTSCapabilities();
                return parser.read(text);
            });
    }
}
