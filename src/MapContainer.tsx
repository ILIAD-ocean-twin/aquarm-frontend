import { onMount, type Component, Accessor, createEffect, onCleanup, on, createSignal } from 'solid-js';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { Feature, View } from 'ol';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { BasicWeek, Filters } from './types';


export const MapContainer: Component<{ data: Accessor<BasicWeek[]>, filters: Filters }> = ({ data, filters }) => {
  const [filteredData, setFilteredData] = createSignal<BasicWeek[]>([]);

  let map: Map;
  let mapElement: HTMLDivElement;
  let sitesLayer: AquacultureSites;
  let hoveredFeature = null;

  onMount(() => {
    map = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{1-4}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            crossOrigin: 'anonymous',
          })
        })
      ],
      view: new View({
        center: transform([12.9, 65.5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 5
      }),
      target: mapElement,
      controls: []
    })

    map.on('pointermove', function (ev) {
      if (hoveredFeature !== null) {
        hoveredFeature.set('hover', 0);
        hoveredFeature = null;
      }

      map.forEachFeatureAtPixel(ev.pixel, function (feature) {
        // @ts-ignore
        feature.set('hover', 1);
        hoveredFeature = feature;
        return true;
      });
    });

    mapElement.getElementsByTagName("div")[0].style.borderRadius = "16px";
  })

  onCleanup(() => {
    sitesLayer?.layer.dispose();
    map.dispose();
  })

  createEffect(on(filteredData, d => {
    if (map && d && !sitesLayer) {
      sitesLayer = new AquacultureSites(d, filters);
      map.addLayer(sitesLayer.layer);
    } else if (map && d && sitesLayer != undefined) {
      map.removeLayer(sitesLayer.layer);
      sitesLayer.layer.dispose();
      sitesLayer = new AquacultureSites(d, filters);
      map.addLayer(sitesLayer.layer);
    }
  }))

  createEffect(() => {
    const showFallow = filters.fallow ? 1 : 0;
    if (sitesLayer) {
      sitesLayer.style.variables.fallow = showFallow;
      map.render();
    }
  })

  createEffect((prev) => {
    const orgs = filters.organizations;
    if (orgs !== prev || !filteredData().length) {
      if (!orgs.length) {
        setFilteredData(data());
      } else {
        setFilteredData(data().filter(bw => !bw.organizations.every(o => !filters.organizations.includes(o))));
      }
    }
    return orgs;
  }, filters.organizations)

  return (
    <div ref={mapElement} class="w-full h-full rounded-2xl shadow-lg" />
  );
};

class AquacultureSites {
  public layer: WebGLPointsLayer<VectorSource>;
  public style: any;
  public source: VectorSource;

  constructor(data: any, filters: Filters) {
    this.source = this.getSource(data);
    this.style = {
      variables: {
        fallow: filters.fallow ? 1 : 0
      },
      filter:
        ['match',
          ['var', 'fallow'],
          1,
          true,
          ['!=', ['get', 'fallow'], 1],
        ],
      'circle-radius': [
        'match',
        ['get', 'hover'],
        1,
        [
          'interpolate',
          ['linear'],
          ['zoom'],
          5,
          4,
          15,
          13,
        ],
        [
          'interpolate',
          ['linear'],
          ['zoom'],
          5,
          1.75,
          15,
          8,
        ]
      ],
      'circle-stroke-color': [
        'match',
        ['get', 'fallow'],
        0,
        [
          'interpolate',
          ['linear'],
          ['get', 'lice'],
          0,
          "#00FF00",
          0.5,
          "#FF0000",
        ],
        "#777"
      ],
      'circle-stroke-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        5,
        0.8,
        15,
        3.5,
      ],
      'circle-fill-color': [
        'match',
        ['get', 'fallow'],
        1,
        "#000",
        [
          'interpolate',
          ['linear'],
          ['get', 'rank'],
          0,
          "#FFF",
          1,
          "#000",
        ]
      ],
      'circle-opacity': [
        'match',
        ['get', 'fallow'],
        1,
        0.6,
        0.8
      ],
    };

    this.layer = new WebGLPointsLayer({
      source: this.source,
      style: this.style
    })
  }

  public update(map: Map) {
    const newLayer = new WebGLPointsLayer({
      source: this.source,
      style: this.style
    });
    map.addLayer(newLayer);
    map.removeLayer(this.layer);
    this.layer.dispose();
    this.layer = newLayer;
  }

  private getSource(data: BasicWeek[]) {
    return new VectorSource({
      features: data.map(dp => new Feature({
        lice: dp.lice,
        rank: dp.rank,
        fallow: dp.isFallow ? 1 : 0,
        geometry: new Point(
          transform([dp.lon, dp.lat], 'EPSG:4326', 'EPSG:3857')
        )
      }))
    })
  }
}
