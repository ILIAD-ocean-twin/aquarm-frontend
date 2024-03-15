import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Filters, TimeSelection } from "./types";

type State = {
  time: TimeSelection
  filters: Filters
  selectedSites: number[]
  visibleLayers: string[]
  allOrganizations: string[]
}

const initialState: State = {
  time: { year: 2024, week: 5 },
  filters: { fallow: true, organizations: [] },
  selectedSites: [],
  visibleLayers: [],
  allOrganizations: []
}

export const makeStateContext = () => {
  const [state, setState] = createStore<State>(initialState);
  return [state, setState] as const;
}

type StateContextType = ReturnType<typeof makeStateContext>
export const StateContext = createContext<StateContextType>()

export function StateProvider(props) {
  return (
    <StateContext.Provider value={makeStateContext()}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useState() { return useContext(StateContext); }
