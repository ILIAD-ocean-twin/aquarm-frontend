import { Component, For, Show, createSignal, onMount } from "solid-js";
import { BsChevronRight, BsChevronDown } from "solid-icons/bs";
import { IDataLayer } from "./layers/IDataLayer";
import { useState } from "./state";
import { Select, createOptions } from "@thisbeyond/solid-select";

export const LayerSwitcher: Component<{ layers: IDataLayer[] }> = (props) => {
  return (
    <div class="absolute left-0 divide-y divide-slate-600 h-full w-64 rounded-l-2xl" style="z-index: 110">
      <div class="text-iliad text-lg w-full bg-[#1e1e23] rounded-tl-2xl">
        <h2 class="py-2 px-4">Filters</h2>
      </div>
      <Filters />

      <div class="text-iliad text-lg w-full bg-[#1e1e23]">
        <h2 class="py-2 px-4">Data Layers</h2>
      </div>
      <For each={props.layers}>{l =>
        <LayerEntry layer={l} />
      }</For>
    </div>
  )
}

const LayerEntry: Component<{ layer: IDataLayer }> = (props) => {
  let desc;
  const [collapsed, setCollapsed] = createSignal<boolean>(true);
  const [_, setState] = useState();

  const toggleLayer = (ev, l: IDataLayer) => {
    const visible = ev.target.checked;
    l.setVisible(visible);
    setState("visibleLayers", (s) => visible ? [l.name, ...s] : s.filter(name => name != l.name));
  }

  onMount(() => {
    desc.innerHTML = props.layer.description;
  })

  return (
    <div class="bg-[#2e2e37] text-[#e9e9f4]">
      <div class="flex h-12 items-center justify-between">
        <div class="cursor-pointer text-sm text-center h-full w-10 hover:bg-black/10 flex justify-center items-center" onclick={() => setCollapsed(pre => !pre)}>
          <Show when={collapsed()} fallback={<BsChevronDown />}>
            <BsChevronRight />
          </Show>
        </div>
        <label class="select-none grow" for={props.layer.name}>
          {props.layer.name}:
        </label>
        <input
          id={props.layer.name}
          class="mx-4 cursor-pointer"
          checked={props.layer.visible}
          onchange={(ev) => toggleLayer(ev, props.layer)}
          type="checkbox" />
      </div>
      <div style="transition: max-height ease-in 220ms" class="overflow-hidden" classList={{ "max-h-0": collapsed(), "max-h-28": !collapsed() }}>
        <div ref={desc} class="p-2 bg-black/10 text-white/70 text-sm [&>a]:underline [&>a]:text-blue-500">
        </div>
      </div>
    </div>
  )
}

const Filters: Component = () => {
  const [state, setState] = useState();

  const setSelectedOrgs = (orgs: string[]) => {
    setState("filters", "organizations", orgs)
  }

  return (
    <div class="flex flex-col divide-y divide-slate-600 bg-[#2e2e37] text-[#e9e9f4]">
      <div class="flex items-center h-12 pl-4">
        <h2 class="w-14 inline-block">Year</h2>
        <input
          class="bg-slate-500 p-1 w-20 rounded"
          type='number'
          value={state.time.year}
          min={2012}
          max={2024}
          onChange={e => setState("time", "year", e.target.valueAsNumber)}
        />
      </div>

      <div class="flex items-center h-12 pl-4">
        <h2 class="w-14 inline-block">Week</h2>
        <input
          class="bg-slate-500 p-1 w-20 rounded"
          type="number"
          value={state.time.week}
          min={1}
          max={52}
          onChange={e => setState("time", "week", e.target.valueAsNumber)}
        />
      </div>

      <div class="flex items-center h-12 pl-4">
        <label class="select-none">
          Show fallow:
          <input
            class="ml-2 cursor-pointer"
            checked={state.filters.fallow}
            onchange={() => setState("filters", "fallow", !state.filters.fallow)}
            type="checkbox" />
        </label>
      </div>

      <div class="flex items-center pl-4 py-2 text-black">
        <div>
          <h2 class="text-white mb-1">Owner organization:</h2>
          <Select class='bg-slate-500 rounded text-sm max-w-56' multiple {...createOptions(state.allOrganizations)} onChange={setSelectedOrgs} />
        </div>
      </div>
    </div>
  )
}