import TileLayer from "ol/layer/Tile";
import TileWMS from 'ol/source/TileWMS.js';
import WMTS from 'ol/source/WMTS';
import Layer from "ol/layer/Layer";
import { optionsFromCapabilities } from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";

const depth = -10;
const sourceLayer = 'temperature';
const style = 'spectral';
const colorScaleRange = [-2, 10];
const colorScale = `${colorScaleRange[0]}%2C${colorScaleRange[1]}`;
const numColorBands = 20;
const logScale = false;


export class TemperatureLayer implements IDataLayer {
    name = "Sea temperature";
    description = ``;
    visible: boolean = false;
    layer: Layer<Source, LayerRenderer<any>>;
    updates = true;

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
                    this.update({ date: this._date });
                    this._initiated = true;
                });
        }
        this.visible = visible;
        this.layer.setVisible(visible);
    }

    public update(params: { date: string }): void {
        this._date = params.date;
        if (this._capabilities != undefined) {
            const source = this.getOceanTempSource(params.date);
            this.layer.setSource(source);
        }
    }

    public getLegend(): HTMLElement {
        return undefined;
        // const img = document.createElement("img");
        // img.src = "/sea_temperature_legend.png";
        // return img;
    }

    private getOceanTempSource(date: string): Source {
        const options = optionsFromCapabilities(this._capabilities, {
            layer: 'IBI_ANALYSISFORECAST_PHY_005_001/cmems_mod_ibi_phy_anfc_0.027deg-2D_PT1H-m_202411/thetao',
            matrixSet: 'EPSG:4326',
            //dimensions: {
            //    'time': '2024-11-15T12:00:00Z'
            //}
        });

        return new WMTS(options);
    }

    private async getCapabilities(): Promise<{}> {
        return fetch('https://wmts.marine.copernicus.eu/teroWmts/IBI_ANALYSISFORECAST_PHY_005_001/cmems_mod_ibi_phy_anfc_0.027deg-2D_PT1H-m_202411?request=GetCapabilities&service=WMTS')
            .then(response => response.text())
            .then(text => {
                const parser = new WMTSCapabilities();
                return parser.read(text);
            });
    }
}
