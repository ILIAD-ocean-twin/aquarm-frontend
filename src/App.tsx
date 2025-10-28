import { type Component, createResource, createSignal, onMount } from 'solid-js';
import { MapContainer } from './MapContainer';
import { useState } from './state';
import { IDataLayer } from './layers/IDataLayer';
import { API_URL } from './constants';
import { TemperatureLayer } from './layers/TemperatureLayer';
import { CMEMSChlorophyllLayer } from './layers/CMEMCSClorophyllLayer';
import { HabitatSuitabilityLayer } from './layers/HabitatSuitabilityLayer';
import { ESRISatelliteImageryLayer } from './layers/ESRISatelliteImageryLayer';
import { BathymetryLayer } from './layers/BathymetryLayer';
import { MPALayer } from './layers/MPALayer';
import { ProtectedAreaDetails } from './ProtectedAreaDetails';
import { EssentialFishHabitatLayer } from './layers/EssentialFishHabitatLayer';


const App: Component = () => {
  const [state, setState] = useState();

  const MPA = new MPALayer("/mpa_uk_light.geojson");

  const layers: IDataLayer[] = [
    MPA,
    new TemperatureLayer(state.date),
    new CMEMSChlorophyllLayer(state.date),
    new HabitatSuitabilityLayer(state.date),
    new ESRISatelliteImageryLayer(),
    new BathymetryLayer(),
    new EssentialFishHabitatLayer()
  ];

  const [maxConn, setMaxConn] = createSignal<number>(0);
  const [connectivityLookup, setConnectivityLookup] = createSignal<Record<string, Record<string, number>>>({});
  const [areaNamelookup, setAreaNameLookup] = createSignal<Record<string, string>>({});

  const [lundyObservations] = createResource(() => fetchLundyObservations("/obis_in_mpa_lundy_per_year.csv"));

  onMount(() => {
    fetchConnectivity("/mpa_connectivity.csv")
      .then(res => {
        setMaxConn(res["max"]);
        setConnectivityLookup(res["lookup"]);
        MPA.setConnectivityLookup(res["lookup"]);
        MPA.setConnectivityMax(res["max"]);
      });
    fetchMPANames("/mpa_uk_light.geojson").then(setAreaNameLookup);
  })

  return (
    <>
      <nav class="font-nunito bg-black/20 text-white py-1">
        <div class="container mx-auto">
          <div>ILIAD Marine Protected Areas Pilot</div>
        </div>
      </nav>

      <div class="container mx-auto mt-6 font-nunito">
        <div class="h-[810px]">
          <MapContainer dataLayers={layers} center={[-2.0, 54.5]} zoom={6} />
        </div>
        <ProtectedAreaDetails
          area={state.selectedArea}
          maxConn={maxConn()}
          connectivityLookup={connectivityLookup()}
          areaNameLookup={areaNamelookup()}
          observations={lundyObservations()}
        />
      </div>
    </>
  );
};

async function fetchConnectivity(url: string): Promise<{ max: number, lookup: Record<string, Record<string, number>> }> {
  const response = await fetch(url);
  const csvText = await response.text();

  const rows = csvText.trim().split('\n');
  const data = rows.map(row => row.split(','));

  let maxConn = 0;
  const lookup: Record<string, Record<string, number>> = {};

  data.forEach(r => {
    const source = r[0];
    const target = r[1];
    const conn = parseFloat(r[2]);

    if (conn > 0 && source !== target) {
      maxConn = Math.max(maxConn, conn);

      if (!lookup[source]) {
        lookup[source] = {};
      }

      lookup[source][target] = conn;
    }
  });

  return {
    max: maxConn, lookup
  };
}



async function fetchMPANames(url: string): Promise<{}> {
  return fetch(url)
    .then(response => response.json())
    .then(d => {
      const areaNames = {};
      d["features"].forEach(f => {
        areaNames[f["properties"]["site_id"]] = f["properties"]["site_name"]
      });
      return areaNames;
    });
}

async function fetchLundyObservations(url: string): Promise<Record<string, Record<string, number>>> {
  const response = await fetch(url);
  const csvText = await response.text();

  const rows = csvText.trim().split('\n');
  const data = rows.map(row => row.split(','));

  const observations: Record<string, Record<string, number>> = {};

  data.slice(1).forEach(r => {
    const year = r[1];
    const specie = r[0];
    const count = parseInt(r[2]);

    if (!observations[year]) {
      observations[year] = {};
    }

    observations[year][specie] = count;
  });

  return observations;
}

export default App;