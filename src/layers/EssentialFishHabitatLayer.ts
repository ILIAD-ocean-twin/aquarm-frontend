import Image from "ol/layer/Image";
import ImageWMS from 'ol/source/ImageWMS';
import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { IDataLayer } from "./IDataLayer";


export class EssentialFishHabitatLayer implements IDataLayer {
    name = "Essential Fish Habitats";
    description = `Essential Fish Habitats from <a href='https://emodnet.ec.europa.eu/geonetwork/srv/eng/catalog.search#/metadata/2103ea75-0137-4b57-bc98-b5fd55800ac7'>EMODnet</a>.`;
    visible: boolean = false;
    layer: Layer<Source, LayerRenderer<any>>;
    updates = true;

    _source: any;
    _initiated: boolean = false;
    _date: string;
    _capabilities: {};

    constructor(date?: string) {
        this._date = date;
        this.layer = new Image({
            visible: false,
            opacity: 0.5,
            source: new ImageWMS({
                url: 'https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_open/ows',
                params: {
                    'LAYERS': 'efh_2025',
                    'VERSION': '1.3.0',
                    'FORMAT': 'image/png',
                    'TRANSPARENT': true
                },
                serverType: 'geoserver',
                crossOrigin: 'anonymous',
                attributions: `Essential Fish Habitats from <a href='https://emodnet.ec.europa.eu/geonetwork/srv/eng/catalog.search#/metadata/2103ea75-0137-4b57-bc98-b5fd55800ac7'>EMODnet</a>.`
            })
        })

    }

    public async setVisible(visible: boolean): Promise<void> {
        this.visible = visible;
        this.layer.setVisible(visible);
    }

    public update(params: { date: string }): void {

    }

    public getLegend(): HTMLElement {
        return undefined;
    }

}
