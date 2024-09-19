import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import { IDataLayer } from "./IDataLayer";
import Layer from "ol/layer/Layer";
import LayerRenderer from "ol/renderer/Layer";
import Source from "ol/source/Source";
import { fetchJellyfish } from "../utils";
import { Point } from "ol/geom";
import Feature from "ol/Feature";
import { fromLonLat } from "ol/proj";
import Icon from "ol/style/Icon";
import { JellyfishObservation } from "../types";

export class JellyfishLayer implements IDataLayer {
  name = "Jellyfish";
  description = `Jellyfish observations. The data is from <a href='https://dugnadforhavet.no/dataportal'>Dugnad for havet</a>, a citizen science project by <a href='https://www.hi.no'>Havforskningsinstituttet<a/>.`;
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;
  updates = true;

  _source: VectorSource;
  _initiated: boolean = false;

  constructor(year: number, week: number) {
    this.layer = new VectorLayer({
      visible: false,
      style: JELLYFISH_STYLE
    })

    this._source = new VectorSource({
      wrapX: false,
    });
    this.layer.setSource(this._source);
    this.update(year, week)
  }

  private async addFeatures(year: number, week: number) {
    const features = await fetchJellyfish(year, week);

    for (let f of features) {
      const geom = new Point(fromLonLat([f.longitude, f.latitude]));
      const feature = new Feature(geom);
      feature.set("name", this.getName(f));
      this._source.addFeature(feature);
    }
  }

  private getName(o: JellyfishObservation) {
    const amount = o.amount > 0 ? o.amount : "unknown";
    const specie = o.species ?? "unknown";

    return `Specie: ${specie}  Amount: ${amount}`
  }

  public update(year: number, week: number) {
    this._source.clear()
    this.addFeatures(year, week)
    this._source.changed();
  }

  public async setVisible(visible: boolean): Promise<void> {
    this.visible = visible;
    this.layer.setVisible(visible);
  }

  public getLegend() {
    return undefined;
  }
}

const JELLYFISH_STYLE = new Style({
  image: new Icon({ src: "/jellyfish.png", scale: 0.7 })
});