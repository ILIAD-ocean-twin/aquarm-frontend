import { type Component, createEffect, Switch, Match, createResource, onMount } from 'solid-js';
import { MapContainer } from './MapContainer';
import { BasicWeek, OimEntry } from './types';
import { SingleSiteDetails } from './SingleSiteDetails';
import { OverviewDetails } from './OverviewDetails';
import { MultiSelectDetails } from './MultiSelectDetails';
import { useState } from './state';
import { IDataLayer } from './layers/IDataLayer';
import { MunicipalityLayer } from './layers/MunicipalityLayer';
import { ProductionAreaLayer } from './layers/ProductionAreaLayer';
import { OceanTempLayer } from './layers/OceanTempLayer';
import { WeatherWarningLayer } from './layers/RiskLayer';
import { TrajectoryLayer } from './layers/TrajectoryLayer';
import { API_URL } from './constants';
import { CurrentRatingLayer } from './layers/CurrentRatingLayer';
import { TemperatureRatingLayer } from './layers/TemperatureRatingLayer';
import { SalinityRatingLayer } from './layers/SalinityRatingLayer';
import { StormRatingLayer } from './layers/StormRatingLayer';
import { JellyfishLayer } from './layers/JellyfishLayer';
import { AlgaeLayer } from './layers/AlgaeLayer';
import { OilLayer } from './layers/OilLayer';
import { OffshoreLayer } from './layers/OffshoreLayer';
import { TemperatureLayer } from './layers/TemperatureLayer';


const App: Component = () => {
  const [state, setState] = useState();

  const layers: IDataLayer[] = [
    new TemperatureLayer(),
    //new AlgaeLayer(),
  ];

  onMount(() => {
    // fetchOimTerms()
    //   .then(terms => setState("oim", terms))
  })

  return (
    <>
      <nav class="font-nunito bg-black/20 text-white py-1">
        <div class="flex justify-between container mx-auto">
          <div>ILIAD Marine Protected Areas Pilot</div>
          <div class="grow text-center">
            <span class="text-amber-400/70"> Intended for demonstration only: </span>
            <span class="text-amber-500/70"> There may be errors and inaccuracies present in the datasets and visualizations</span>
          </div>
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