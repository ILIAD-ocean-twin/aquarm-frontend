import { onMount, type Component, createEffect, onCleanup, on, createSignal, Switch, Match, ParentComponent, For, Show } from 'solid-js';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, XYZ } from 'ol/source';
import { defaults } from 'ol/control'
import { transform } from 'ol/proj';
import { AquacultureSitesLayer } from './layers/AquacultureSitesLayer';
import { useState } from './state';
import { IDataLayer } from './layers/IDataLayer';
import { LayerSwitcher } from './LayerSwitcher';
import { BsBrightnessHighFill, BsMoonFill } from 'solid-icons/bs';


interface MapContainerProps {
  dataLayers: IDataLayer[],
  center?: [number, number],
  zoom?: number
}

export const MapContainer: Component<MapContainerProps> = ({ dataLayers, center, zoom }) => {
  const [state, setState] = useState();

  const [hoveredFeature, setHoveredFeature] = createSignal<any>(null);

  let map: Map;
  let mapElement: HTMLDivElement;
  let tooltip: HTMLDivElement;
  let sitesLayer: AquacultureSitesLayer;
  let selectedFeatures = [];

  const lightLayer = new TileLayer({
    visible: !state.darkmode,
    source: new OSM(),
  });

  const darkLayer = new TileLayer({
    visible: state.darkmode,
    source: new XYZ({
      url: "https://{1-4}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      crossOrigin: 'anonymous',
    })
  });

  onMount(async () => {
    map = new Map({
      layers: [
        lightLayer,
        darkLayer
      ],
      view: new View({
        center: transform(center ?? [12.9, 65.5], 'EPSG:4326', 'EPSG:3857'),
        zoom: zoom ?? 5
      }),
      target: mapElement,
      controls: defaults({
        zoom: false,
        attribution: true,
        rotate: false
      })
    })

    map.on('pointermove', function (ev) {
      if (hoveredFeature() !== null) {
        hoveredFeature().set('hover', 0);
      }

      const features = map.getFeaturesAtPixel(ev.pixel)
        .filter(f => f.getGeometry().getType() != "LineString"); //  f.get('siteId') || f.get('area'));

      features.sort(f => f.get('siteId') ? -1 : 1);
      if (features.length) {
        // @ts-ignore
        features[0].set('hover', 1);
        setHoveredFeature(features[0]);
        tooltip.style.left = ev.pixel[0] - 80 + "px";
        tooltip.style.top = (ev.pixel[1] - tooltip.clientHeight - 16) + "px";
      } else {
        setHoveredFeature(null);
      }
    });

    map.on('click', function (ev) {
      const features = map.getFeaturesAtPixel(ev.pixel).filter(f => f.get('siteId'));
      if (features.length == 0) {
        selectedFeatures.forEach(f => f.set('selected', 0));
        selectedFeatures = [];
      }
      else {
        const f = features[0];
        const sID = f.get('siteId');
        if (sID) {
          if (selectedFeatures.every(v => v.get('siteId') != sID)) {
            selectedFeatures.push(f);
            // @ts-ignore
            f.set('selected', 1);
          }
          else {
            // @ts-ignore
            f.set('selected', 0);
            selectedFeatures = selectedFeatures.filter(v => v.get('siteId') != sID);
          }
        }
      }
      setState("selectedSites", selectedFeatures.map(f => f.get("siteId")));
    });

    // @ts-ignore
    mapElement.getElementsByClassName("ol-viewport")[0].style.borderRadius = "16px";

    Object.values(dataLayers).forEach(l => map.addLayer(l.layer));
    sitesLayer = new AquacultureSitesLayer(state.filters, state.showSites);
    map.addLayer(sitesLayer.layer);
  })

  onCleanup(() => {
    sitesLayer?.layer.dispose();
    map.dispose();
  })

  createEffect(() => {
    const darkmode = state.darkmode;
    if (lightLayer)
      lightLayer.setVisible(!darkmode);
    if (darkLayer)
      darkLayer.setVisible(darkmode);
  })

  // Show/Hide tooltip on hover
  createEffect(on(hoveredFeature, f => {
    tooltip.classList.toggle("hidden", !!!f);
    mapElement.classList.toggle('cursor-pointer', !!f?.get('siteId'));
  }))

  createEffect(() => {
    const sites = state.selectedSites;
    selectedFeatures.forEach(f => f.set('selected', sites.includes(f.get('siteId'))));
    selectedFeatures = selectedFeatures.filter(f => sites.includes(f.get('siteId')));
  })

  createEffect(() => {
    const date = state.date;
    const layers = dataLayers.filter(dl => dl.updates);
    layers.forEach(l => l.update({ date }));
  })

  createEffect(() => {
    const visible = state.showSites
    sitesLayer.toggleVisible(visible);
  })

  createEffect(() => {
    const showFallow = state.filters.fallow ? 1 : 0;
    if (sitesLayer) {
      sitesLayer.style.variables.fallow = showFallow;
      map.render();
    }
  })

  return (
    <div ref={mapElement} class="w-full h-full rounded-2xl shadow-lg relative">
      <div ref={tooltip} class="absolute text-black z-50 w-[200px] pointer-events-none flex">
        <Switch fallback={
          <div class="mx-auto py-1 px-2 rounded shadow-lg bg-white/50 font-semibold">
            {hoveredFeature()?.get("name") ?? "Ukjent"}
          </div>
        }>
          <Match when={hoveredFeature()?.get('awareness_level') != undefined}>
            <div class="w-full py-1 px-2 z-50 rounded shadow-lg bg-white/80">
              <h2 class="font-semibold">{hoveredFeature()?.get('area')}</h2>
              <p class="text-sm">{hoveredFeature()?.get('description')}</p>
            </div>
          </Match>
          <Match when={hoveredFeature()?.get('siteId') != undefined}>
            <div class="mx-auto py-1 px-2 rounded shadow-lg bg-white/80">
              <h2 class="font-semibold">{hoveredFeature()?.get("name") ?? "Ukjent"}</h2>
              <div><span>Lusetall:</span> {hoveredFeature()?.get("lice")?.toFixed(2) ?? "ikke målt"}</div>
            </div>
          </Match>
          <Match when={hoveredFeature()?.get('kommunenavn') != undefined}>
            <div class="bg-white py-1 px-2 rounded shadow-lg bg-white/80 w-auto text-center font-semibold">
              {hoveredFeature()?.get('kommunenavn')}
            </div>
          </Match>
          <Match when={hoveredFeature()?.get('protection_focus') != undefined}>
            <div class="bg-white/75 py-1 px-2 rounded shadow-lg w-auto font-semibold text-sm">
              <div>Site ID: <div class="font-normal">{hoveredFeature()?.get('site_id')}</div></div>
              <div>Designation: <div class="font-normal">{hoveredFeature()?.get('designation')}</div></div>
              <div>Protection focus: <div class="font-normal">{hoveredFeature()?.get('protection_focus')}</div></div>
            </div>
          </Match>
          <Match when={hoveredFeature()?.get('specie') != undefined}>
            <div class="py-1 px-2 rounded shadow-lg bg-white/80 w-auto text-center font-semibold">
              <div class="font-bold">{hoveredFeature()?.get('date')}</div>
              <div class="flex flex-col text-left">
                <div>Specie: <span class="font-normal">{hoveredFeature()?.get('specie')}</span></div>
                <div>Amount: <span class="font-normal">{hoveredFeature()?.get('amount')}</span></div>
                <div>Length: <span class="font-normal">{hoveredFeature()?.get('length')}</span></div>
              </div>
            </div>
          </Match>
        </Switch>
      </div>

      <DarkmodeButton />

      <Legends>
        <For each={dataLayers.filter(l => state.visibleLayers.includes(l.name))}>{l =>
          <Legend content={l.getLegend()} title={l.name} />
        }</For>
      </Legends>
      <LayerSwitcher layers={dataLayers} />
    </div>
  );
};

const Legends: ParentComponent = (props) => {
  return (
    <div class="absolute right-3 bottom-8 flex flex-col gap-2 pointer-events-none opacity-90" style={"z-index: 110;"}>
      {props.children}
    </div>
  )
}

const Legend: Component<{ title: string, content?: HTMLElement }> = (props) => {
  let elem;
  onMount(() => {
    if (props.content)
      elem.appendChild(props.content);
  });
  return (
    <Show when={props.content}>
      <div ref={elem} class="bg-white px-2 py-1 rounded shadow-md shadow-black/50 pointer-events-none">
        {props.title}
      </div>
    </Show>
  )
}

const DarkmodeButton: Component = () => {
  const [state, setState] = useState();

  return (
    <div
      title="Toggle dark base layer."
      class="absolute top-3 right-3 shadow-md rounded-full bg-[#2e2e37] hover:bg-[#1e1e23] cursor-pointer p-3 text-white text-lg"
      style={"z-index: 110;"}
      onclick={() => setState("darkmode", dm => !dm)}
    >
      <Show when={state.darkmode} fallback={<BsMoonFill />}>
        <BsBrightnessHighFill />
      </Show>
    </div>
  )
}