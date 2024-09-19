import TileLayer from "ol/layer/Tile";
import TileWMS from 'ol/source/TileWMS.js';
import Layer from "ol/layer/Layer";
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


export class OceanTempLayer implements IDataLayer {
  name = "Sea temperature";
  description = `Average sea temperature for the middle of the selected week. Fetched from the Norkyst800 model by <a href='https://www.met.no/en'>MET Norway</a>.`;
  visible: boolean = false;
  layer: Layer<Source, LayerRenderer<any>>;
  updates = true;

  _source: any;
  _initiated: boolean = false;
  _year: number;
  _week: number;

  constructor(year: number, week: number) {
    this.layer = new TileLayer({
      visible: false,
      opacity: 0.5
    });
    this._year = year;
    this._week = week;
  }

  public async setVisible(visible: boolean): Promise<void> {
    if (visible && !this._initiated) {
      this.update(this._year, this._week);
      this._initiated = true;
    }
    this.visible = visible;
    this.layer.setVisible(visible);
  }

  public update(year: number, week: number): void {
    this._year = year;
    this._week = week;
    this.layer.setSource(this.getOceanTempSource(year, week));
  }

  public getLegend(): HTMLElement {
    const img = document.createElement("img");
    img.src = "/sea_temperature_legend.png";
    return img;
  }

  private getOceanTempSource(year: number, week: number): Source {
    const date = weekToDate(year, week);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return new TileWMS({
      attributions:
        'Tiles © <a href="https://thredds.met.no/thredds/fou-hi/norkyst800v2.html"' +
        ' target="_blank">MET</a>',
      url: `https://thredds.met.no/thredds/wms/fou-hi/norkyst800m/NorKyst-800m_ZDEPTHS_avg.an.${year}${month}${day}00.nc`,
      params: {
        LAYERS: sourceLayer,
        elevation: depth,
        time: `${year}-${month}-${day}T12:00:00.000Z`,
        TRANSPARENT: true,
        STYLES: `boxfill/${style}`,
        COLORSCALERANGE: colorScale,
        NUMCOLORBANDS: numColorBands,
        LOGSCALE: logScale,
        TILED: true,
      }
    })
  }
}

function weekToDate(year: number, week: number) {
  let date = new Date(year, 0, (1 + (week - 1) * 7));
  date.setDate(date.getDate() + (1 - date.getDay()) + 3);  // get Thursdays (+3)
  return date;
}