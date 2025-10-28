import TileLayer from "ol/layer/Tile";
import WMTS from 'ol/source/WMTS';
import Layer from "ol/layer/Layer";
import { optionsFromCapabilities } from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";


export class BathymetryLayer implements IDataLayer {
    name = "Bathymetry";
    description = `CMEMS Bathymetry data from <a href='https://data.marine.copernicus.eu/product/NWSHELF_ANALYSISFORECAST_PHY_004_013/services'>Copernicus Marine Services</a>.`;
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

    private getSource(): WMTS {
        const options = optionsFromCapabilities(this._capabilities, {
            layer: 'NWSHELF_ANALYSISFORECAST_PHY_004_013/cmems_mod_nws_phy_anfc_0.027deg-3D_static_202411--ext--bathy/deptho',
            matrixSet: 'EPSG:4326',
        });

        return new WMTS({
            ...options,
            attributions: "CMEMS Bathymetry from <a href='https://data.marine.copernicus.eu/product/NWSHELF_ANALYSISFORECAST_PHY_004_013/services'>Copernicus</a>"
        });
    }

    private async getCapabilities(): Promise<{}> {
        return fetch('https://wmts.marine.copernicus.eu/teroWmts/NWSHELF_ANALYSISFORECAST_PHY_004_013/cmems_mod_nws_phy_anfc_0.027deg-3D_static_202411--ext--bathy?request=GetCapabilities&service=WMS')
            .then(response => response.text())
            .then(text => {
                const parser = new WMTSCapabilities();
                return parser.read(text);
            });
    }
}
