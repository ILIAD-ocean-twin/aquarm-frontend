import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";


export class OilLayer implements IDataLayer {
    name = "Offshore installations";
    description = "Oil and gas installations from <a href='https://emodnet.ec.europa.eu/geonetwork/srv/eng/catalog.search#/metadata/ddbe3597-4e3f-4e74-8d31-947c4efef2e9'>EMODnet Human Activities</a>.";
    visible: boolean = false;
    layer: Layer<Source, LayerRenderer<any>>;
    updates = false;

    _url: string;
    _initiated: boolean = false;

    _source = new TileWMS({
        url: 'https://ows.emodnet-humanactivities.eu/wms',
        params: { 'LAYERS': 'platforms', 'TILED': true },
        serverType: 'geoserver',
        attributions:
            'Platforms from <a href="https://emodnet.ec.europa.eu/geonetwork/srv/eng/catalog.search#/metadata/ddbe3597-4e3f-4e74-8d31-947c4efef2e9"' +
            ' target="_blank">EMODnet</a>',
    })

    constructor(dataUrl?: string) {
        this.layer = new TileLayer({
            visible: false,
        })
    }

    public async setVisible(visible: boolean): Promise<void> {
        if (visible && !this._initiated) {
            this.layer.setSource(this._source);
            this._initiated = true;
        }
        this.visible = visible;
        this.layer.setVisible(visible);
    }

    public getLegend() {
        return undefined;
    }

}
