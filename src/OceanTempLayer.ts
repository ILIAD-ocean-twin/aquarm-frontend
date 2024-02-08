import TileLayer from "ol/layer/Tile";
import TileWMS from 'ol/source/TileWMS.js';

const year = '2024';
const month = '02';
const day = '01';
const depth = -0;
const sourceLayer = 'temperature';
const style = 'rainbow';
const colorScaleRange = [-2, 10];
const colorScale = `${colorScaleRange[0]}%2C${colorScaleRange[1]}`;
const numColorBands = 20;
const logScale = false;


export const getOceanTemp = (year: number = 2024, month: string = '02', day: string = '01') =>
    new TileLayer({
        visible: false,
        opacity: 0.5,
        source: new TileWMS({
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
            },
        })
    });