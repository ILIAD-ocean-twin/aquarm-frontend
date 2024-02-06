import { createSignal, type Component, For } from 'solid-js';
import { MapContainer } from './MapContainer';

const PLACEMENTS = ["SJØ", "HAV", "LAND"];

const App: Component = () => {
  const [placement, setPlacement] = createSignal<string>("SJØ");

  return (
    <div class="container mx-auto mt-12 flex gap-4">
      <div class="w-48 text-white">
        <h2 class="text-lg">Placement:</h2>
        <div class="flex flex-col mt-1 gap-1">
          <For each={PLACEMENTS}>{(p) => {
            return (
              <label class="text-sm">
                <input
                  class="mr-2"
                  onChange={
                    ev => {
                      if (ev.target.checked) {
                        setPlacement(p)
                      }
                    }
                  }
                  type="radio"
                  checked={placement() == p} />
                {p}
              </label>)
          }}</For>
        </div>
      </div>
      <div class="grow h-[800px]">
        <MapContainer placement={placement} />
      </div>
    </div>
  );
};

export default App;
