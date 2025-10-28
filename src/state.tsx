import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Filters, OimEntry, TimeSelection } from "./types";

type State = {
  time: TimeSelection
  date: string
  filters: Filters
  showSites: boolean
  selectedSites: number[]
  visibleLayers: string[]
  allOrganizations: string[]
  darkmode: boolean
  oim: { [key in string]: OimEntry }
  selectedArea?: {}
  areaNames?: { [key in string]: string }
}

const initialState: State = {
  time: { year: 2024, week: 1 },
  date: new Date().toISOString().split('T')[0],
  filters: { fallow: true, organizations: [] },
  showSites: true,
  selectedSites: [],
  visibleLayers: [],
  allOrganizations: [],
  darkmode: true,
  oim: {},
  selectedArea: undefined,
  areaNames: {}
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
