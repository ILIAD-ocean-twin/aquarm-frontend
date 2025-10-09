import { type Component, onMount } from 'solid-js';
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


const App: Component = () => {
  const [state, setState] = useState();

  const layers: IDataLayer[] = [
    new TemperatureLayer(state.date),
    new CMEMSChlorophyllLayer(state.date),
    new HabitatSuitabilityLayer(state.date),
    new ESRISatelliteImageryLayer(),
    new BathymetryLayer(),
    new MPALayer()
  ];

  onMount(() => {
    // fetchOimTerms()
    //   .then(terms => setState("oim", terms))
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
      </div>
    </>
  );
};

const fetchOimTerms = async () =>
  fetch(API_URL + "/oim")
    .then(d => d.json())

export default App;