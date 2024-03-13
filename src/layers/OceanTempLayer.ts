import TileLayer from "ol/layer/Tile";
import TileWMS from 'ol/source/TileWMS.js';

const depth = -0;
const sourceLayer = 'temperature';
const style = 'rainbow';
const colorScaleRange = [-2, 10];
const colorScale = `${colorScaleRange[0]}%2C${colorScaleRange[1]}`;
const numColorBands = 20;
const logScale = false;

function weekToDate(year: number, week: number) {
  let date = new Date(year, 0, (1 + (week - 1) * 7));
  date.setDate(date.getDate() + (1 - date.getDay()) + 3);  // get Thursdays (+3)
  return date;
}


export const getOceanTempLayer = (year: number, week: number) => {
  return new TileLayer({
    visible: false,
    opacity: 0.5,
    source: getOceanTempSource(year, week)
  });
}

export const getOceanTempSource = (year: number, week: number) => {
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
      //BGCOLOR: '0x000000',  // Not needed with TRANSPARENT set to true
      STYLES: `boxfill/${style}`,
      COLORSCALERANGE: colorScale,
      NUMCOLORBANDS: numColorBands,
      LOGSCALE: logScale,
      TILED: true,
    }
  })
}