import TileLayer from "ol/layer/Tile";
import WMTS from 'ol/source/WMTS';
import Layer from "ol/layer/Layer";
import { optionsFromCapabilities } from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";


export class CMEMSChlorophyllLayer implements IDataLayer {
    name = "Chlorophyll";
    description = `Chlorophyll from <a href='https://data.marine.copernicus.eu/product/IBI_ANALYSISFORECAST_BGC_005_004/services'>Copernicus Marine Services</a>.`;
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
            const source = this.getChloropyhllSource(params.date);
            this.layer.setSource(source);
        }
    }

    public getLegend(): HTMLElement {
        return undefined;
        // const img = document.createElement("img");
        // img.src = "/sea_temperature_legend.png";
        // return img;
    }

    private getChloropyhllSource(date: string): Source {
        const options = optionsFromCapabilities(this._capabilities, {
            layer: 'IBI_ANALYSISFORECAST_BGC_005_004/cmems_mod_ibi_bgc_anfc_0.027deg-3D_P1D-m_202411/chl',
            matrixSet: 'EPSG:4326',
        });

        options.dimensions.time = `${date}T00:00:00.000Z`;

        console.log(options);

        return new WMTS({
            ...options,
            attributions: "Chlorophyll from <a href='https://data.marine.copernicus.eu/product/IBI_ANALYSISFORECAST_BGC_005_004/services'>Copernicus</a>"
        });
    }

    private async getCapabilities(): Promise<{}> {
        return fetch('https://wmts.marine.copernicus.eu/teroWmts/IBI_ANALYSISFORECAST_BGC_005_004/cmems_mod_ibi_bgc_anfc_0.027deg-3D_P1D-m_202411?request=GetCapabilities&service=WMS')
            .then(response => response.text())
            .then(text => {
                const parser = new WMTSCapabilities();
                return parser.read(text);
            });
    }
}
