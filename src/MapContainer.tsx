import { onMount, type Component, Accessor, createEffect } from 'solid-js';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { Feature, View } from 'ol';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';


export const MapContainer: Component<{ placement: Accessor<string> }> = ({ placement }) => {
  let map: Map;
  let mapElement: HTMLDivElement;
  let sitesLayer: AquacultureSites;

  onMount(() => {
    fetch("basic-all-2023-52-v3.json")
      .then(d => d.json() as Promise<BasicWeek[]>)
      .then(data => {
        const t0 = performance.now();

        const purposes = data.reduce((pre, cur) => {
          cur.purposes?.forEach(v => pre.add(v));
          return pre;
        }, new Set<string>());

        const organizations = data.reduce((pre, cur) => {
          cur.organizations?.forEach(v => pre.add(v));
          return pre;
        }, new Set<string>());

        const productionTypes = data.reduce((pre, cur) => {
          cur.productionTypes?.forEach(v => pre.add(v));
          return pre;
        }, new Set<string>());

        const placements = data.reduce((pre, cur) => {
          pre.add(cur.placement);
          return pre;
        }, new Set<string>());

        console.log("took:", performance.now() - t0)
        console.log(purposes)
        console.log(organizations)
        console.log(productionTypes)
        console.log(placements)

        sitesLayer = new AquacultureSites(data, placement());

        map = new Map({
          layers: [
            new TileLayer({
              source: new XYZ({
                url: "https://{1-4}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                crossOrigin: 'anonymous',
              })
            }),
            sitesLayer.layer
          ],
          view: new View({
            center: transform([12.9, 65.5], 'EPSG:4326', 'EPSG:3857'),
            zoom: 5
          }),
          target: mapElement,
          controls: []
        })

        mapElement.getElementsByTagName("div")[0].style.borderRadius = "16px";
      })

    return () => map.dispose()
  })

  createEffect(() => {
    const selection = placement();
    if (sitesLayer) {
      sitesLayer.style.variables.placements = selection;
      map.render();
    }
  })

  return (
    <div ref={mapElement} class="w-full h-full rounded-2xl shadow-lg" />
  );
};

interface BasicWeek {
  id: number
  name: string
  lat: number
  lon: number
  lice?: number
  organizations?: string[]
  purposes?: string[]
  productionTypes?: string[]
  species?: string[]
  placement?: string
}

class AquacultureSites {
  public layer: WebGLPointsLayer<VectorSource>;
  public style: any;

  constructor(data: any, placements: string) {
    this.style = {
      variables: {
        placements: placements
      },
      filter: ['==', ['get', 'placement'], ['var', 'placements']],
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        5,
        1.2,
        15,
        6,
      ],
      'circle-fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'lice'],
        0,
        "#00FF00",
        0.5,
        "#FF0000",
      ],
      'circle-opacity': 0.5,
    }
    this.layer = new WebGLPointsLayer({
      source: this.getSource(data),
      style: this.style
    })
  }

  private getSource(data: BasicWeek[]) {
    return new VectorSource({
      features: data.map(dp => new Feature({
        lice: dp.lice,
        placement: dp.placement,
        geometry: new Point(
          transform([dp.lon, dp.lat], 'EPSG:4326', 'EPSG:3857')
        )
      }))
    })
  }
}
