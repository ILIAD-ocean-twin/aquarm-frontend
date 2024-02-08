import { onMount, type Component, Accessor, createEffect, onCleanup, on, createSignal, Setter, batch } from 'solid-js';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM.js';
import { transform } from 'ol/proj';
import { View } from 'ol';
import { BasicWeek, Filters, SiteSelection } from './types';
import { AquacultureSitesLayer } from './AquacultureSitesLayer';


interface MapContainerProps {
  data: Accessor<BasicWeek[]>,
  filters: Filters,
  selectedSites: Accessor<SiteSelection[]>
  setSelectedSites: Setter<SiteSelection[]>
}

export const MapContainer: Component<MapContainerProps> = ({ data, filters, selectedSites, setSelectedSites }) => {
  const [filteredData, setFilteredData] = createSignal<BasicWeek[]>([]);
  const [selectedFeatures, setSelectedFeatures] = createSignal<any[]>([]);
  const [hoveredFeature, setHoveredFeature] = createSignal<any>(null);

  let map: Map;
  let mapElement: HTMLDivElement;
  let tooltip: HTMLDivElement;
  let sitesLayer: AquacultureSitesLayer;

  onMount(() => {
    map = new Map({
      layers: [
        /*
        new TileLayer({
          source: new XYZ({
            url: "https://{1-4}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            crossOrigin: 'anonymous',
          })
        })*/
        new TileLayer({
          source: new OSM(),
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
      if (hoveredFeature() !== null) {
        hoveredFeature().set('hover', 0);
      }

      const features = map.getFeaturesAtPixel(ev.pixel);
      if (features.length) {
        // @ts-ignore
        features[0].set('hover', 1);
        setHoveredFeature(features[0]);
        tooltip.style.left = ev.pixel[0] - 70 + "px";
        tooltip.style.top = (ev.pixel[1] - tooltip.clientHeight - 30) + "px";
      } else {
        setHoveredFeature(null);
      }
    });

    map.on('click', function (ev) {
      const features = map.getFeaturesAtPixel(ev.pixel);
      if (features.length == 0) {
        selectedFeatures().forEach(f => f.set('selected', 0));
        setSelectedFeatures([]);
      }
      else {
        const f = features[0];
        const sID = f.get('siteId');
        if (selectedFeatures().every(v => v.get('siteId') != sID)) {
          setSelectedFeatures([f, ...selectedFeatures()]);
          // @ts-ignore
          f.set('selected', 1);
        }
        else {
          // @ts-ignore
          f.set('selected', 0);
          setSelectedFeatures(selectedFeatures().filter(v => v.get('siteId') != sID));
        }
      }
    });

    // @ts-ignore
    mapElement.getElementsByClassName("ol-viewport")[0].style.borderRadius = "16px";
  })

  createEffect(on(hoveredFeature, f => {
    if (!f) {
      mapElement.classList.toggle('cursor-pointer', false);
      tooltip.classList.toggle("hidden", true);
    } else {
      mapElement.classList.toggle('cursor-pointer', true);

      tooltip.classList.toggle("hidden", false);
    }
  }))

  onCleanup(() => {
    sitesLayer?.layer.dispose();
    map.dispose();
  })

  createEffect(() => {
    const sites = selectedFeatures().map(f => ({
      id: f.get("siteId"),
      coords: [f.get('lon'), f.get('lat')]
    }));
    setSelectedSites(sites);
  })

  createEffect(on(filteredData, d => {
    if (map && d && !sitesLayer) {
      sitesLayer = new AquacultureSitesLayer(d, filters);
      map.addLayer(sitesLayer.layer);
    } else if (map && d && sitesLayer != undefined) {
      map.removeLayer(sitesLayer.layer);
      sitesLayer.layer.dispose();
      sitesLayer = new AquacultureSitesLayer(d, filters);
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

  createEffect(on(data, d => {
    if (!filters.organizations.length) {
      setFilteredData(d);
    } else {
      setFilteredData(d.filter(bw => !bw.organizations.every(o => !filters.organizations.includes(o))));
    }
  }))

  return (
    <div ref={mapElement} class="w-full h-full rounded-2xl shadow-lg relative">
      <div ref={tooltip} class="absolute bg-white p-1 w-[140px] z-50 rounded shadow text-black opacity-90">
        <h2 class="font-semibold">{hoveredFeature()?.get("name") ?? "Ukjent"}</h2>
        <div><span>Lusetall:</span> {hoveredFeature()?.get("lice")?.toFixed(2) ?? "ikke målt"}</div>
      </div>
    </div>
  );
};
