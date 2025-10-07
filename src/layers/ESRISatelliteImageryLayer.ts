import TileLayer from "ol/layer/Tile";
import WMTS from 'ol/source/WMTS';
import Layer from "ol/layer/Layer";
import { optionsFromCapabilities } from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";


export class ESRISatelliteImageryLayer implements IDataLayer {
    name = "Satellite imagery";
    description = `ESRI Statellite imagery from <a href='https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'>ArcGIS</a>.`;
    visible: boolean = false;
    layer: Layer<Source, LayerRenderer<any>>;
    updates = false;

    _source: any;
    _initiated: boolean = false;
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
            this.layer.setSource(this.getSource());
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
            layer: 'World_Imagery',
            matrixSet: 'EPSG:4326',
        });

        return new WMTS({
            ...options,
            attributions: "Statellite imagery from <a href='https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'>ArcGIS</a>"
        });
    }

    private async getCapabilities(): Promise<{}> {
        return fetch('https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/1.0.0/WMTSCapabilities.xml')
            .then(response => response.text())
            .then(text => {
                const parser = new WMTSCapabilities();
                return parser.read(text);
            });
    }
}
