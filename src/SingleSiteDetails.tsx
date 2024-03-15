import { Component, Show, createSignal, createResource, For } from "solid-js";
import Dismiss from "solid-dismiss";

import { BasicWeek } from "./types";
import { WeeklyLiceChart } from "./components/WeeklyLiceChart";
import { useState } from "./state";
import { Spinner } from "./components/Spinner";
import { fetchHistoricData } from "./utils";
import { Windrose } from "./components/Windrose";
import { API_URL } from "./constants";


interface SingleSiteDetailsProps {
  site: BasicWeek
}

export const SingleSiteDetails: Component<SingleSiteDetailsProps> = (props) => {
  const [state, _] = useState();

  const [windData] = createResource(
    [props.site.lat, props.site.lon],
    fetchWindForecast);

  const [liceData] = createResource(
    () => [[state.selectedSites[0]], state.time.year, state.time.week],
    fetchHistoricData);

  const seaTemp = () => {
    if (!liceData.loading) {
      const data = liceData()[props.site.id];
      const temp = data[data.length - 1].seaTemperature?.toFixed(1);
      return temp ? temp + "°c" : "NA";
    }
    else
      return undefined;
  }

  return (
    <div class="mt-4">
      <div class="flex gap-2 items-center">
        <div class="text-white font-bold text-2xl">{props.site.name}</div>
        <div class="bg-neutral-800 text-neutral-300 text-sm px-2 py-[2px] rounded">
          week {state.time.week}
        </div>
      </div>

      <div class="grid grid-cols-2 gap-x-8 gap-y-6 pb-12 mt-2 w-full justify-stretch">
        <div class="flex flex-col gap-6">
          <div class="flex gap-8 pt-4">
            <NumberDisplay value={props.site.lice?.toFixed(2) ?? "NA"} subtitle="Adult female lice" />
            <NumberDisplay value={seaTemp()} subtitle="Sea temperature" />
          </div>

          <div>
            <div class="flex gap-2 pb-1">
              <For each={props.site.organizations}>{org =>
                <div class="bg-neutral-800 text-neutral-300 text-sm px-2 py-[4px] rounded">
                  {org}
                </div>
              }</For>
            </div>
            <div class="text-iliad">Organizations</div>
          </div>
          <div class="grow" />
          <div>
            <h3 class="text-white/80 font-semibold text-xl mb-1">Meteogram</h3>
            <ImageModal src={`https://www.yr.no/en/content/${props.site.lat},${props.site.lon}/meteogram.svg?mode=dark`} />
          </div>
        </div>

        <div>
          <h3 class="text-white/80 font-semibold text-xl mb-1">Marinogram</h3>
          <ImageModal src={`https://jtimeseries.k8s.met.no/jtimeseries-webservices/marinogram?latitude=${props.site.lat}&longitude=${props.site.lon}&waterTemperature=true&airTemperature=true&dewpointTemperature=true&pressure=true&waveHeight=true&waveDirection=true&currentDirection=true&currentSpeed=true&windDirection=true&windSpeed=true&timezone=Europe%2FOslo&language=en`} />
        </div>

        <div>
          <h3 class="text-white/80 font-semibold text-xl mb-1">Lice counts <span class="text-sm">(Adult female lice)</span></h3>
          <div class="h-[440px]">
            <Show when={!liceData.loading} fallback={"loading..."}>
              <WeeklyLiceChart data={liceData} sites={[props.site]} />
            </Show>
          </div>
        </div>
        <div>
          <h3 class="text-white/80 font-semibold text-xl">Wind rose <span class="text-sm">(9-day forecast)</span></h3>
          <div class="h-[440px]">
            <Show when={!windData.loading} fallback={"loading..."}>
              <Windrose data={windData()} />
            </Show>
          </div>
        </div>
      </div>
    </div>
  )
}

const NumberDisplay: Component<{ value?: number | string, subtitle: string }> = (props) => {
  return (
    <div>
      <h1 class="text-white text-4xl">{props.value ?? <Spinner />}</h1>
      <h2 class="text-iliad mt-[-5px]">{props.subtitle}</h2>
    </div>
  )
}

const fetchWindForecast = ([lat, lon]) =>
  fetch(API_URL + `/windrose?lat=${lat}&lon=${lon}`).then(r => r.json());


const ImageModal: Component<{ src: string }> = (props) => {
  const [open, setOpen] = createSignal(false);
  let imgElem: HTMLImageElement;

  const onClickOverlay = (e) => {
    if (e.target !== e.currentTarget) return;
    setOpen(false);
  };

  return (
    <>
      <img class="rounded-md cursor-pointer" ref={imgElem} src={props.src} />
      <Dismiss
        menuButton={imgElem}
        open={open}
        setOpen={setOpen}
        modal
      >
        <div
          class="modal-container bg-black/50"
          onClick={onClickOverlay}
          role="presentation"
        >
          <div class="modal rounded-md p-2 bg-white shadow-xl" role="dialog" aria-modal="true" tabindex="-1">
            <img class="rounded-md" src={props.src} />
          </div>
        </div>
      </Dismiss>
    </>
  );
};