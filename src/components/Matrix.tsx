import { Accessor, Component, For, onMount } from "solid-js"
import { BasicWeek, ConnectivityData } from "../types"
import chroma from "chroma-js";

interface MatrixProps {
  sites: Accessor<BasicWeek[]>,
  matrix: Accessor<ConnectivityData>
}

const spectral = chroma.scale('Spectral').domain([1, 0]);

export const CorrelationMatrix: Component<MatrixProps> = (props) => {
  const rows = () => props.matrix().connectivity_matrix;
  const sites = () => props.sites().map(s => s.name);

  return (
    <div class="flex mb-16">
      <div class="flex flex-col justify-around pr-2 text-right text-neutral-400 font-sm">
        <For each={sites()}>{s =>
          <div>{s}</div>
        }</For>
      </div>
      <div>
        <Grid rows={rows()} />
        <div class="absolute text-neutral-400 font-sm">
          <For each={sites()}>{s =>
            <div class="size-10 float-left pl-5">
              <p class="rotate-[55deg] w-16 origin-left truncate">{s}</p>
            </div>
          }</For>
        </div>
      </div>
    </div>
  )
}

const Grid: Component<{ rows: number[][] }> = (props) => {
  return (
    <div class="">
      <table class="border-collapse border">
        <tbody>
          <For each={props.rows}>{r =>
            <GridRow values={r} />
          }</For>
        </tbody>
      </table>
    </div>
  )
}

const GridRow: Component<{ values: number[] }> = ({ values }) => {
  return <tr>
    <For each={values}>{v =>
      <GridCell value={v} />
    }</For>
  </tr>
}

const GridCell: Component<{ value: number }> = ({ value }) => {
  let tooltip, cell;

  const style = {
    background: spectral(value / 500000), //  `rgba(${value / 500000 * 255}, 20, 20, ${value > 50 ? 1 : 0})`
    //opacity: `${value > 500 ? '90%' : '60%'}`
  }

  onMount(() => {
    cell.onmouseenter = () => tooltip.style.opacity = "100%";
    cell.onmouseleave = () => tooltip.style.opacity = "0%";
    tooltip.style.left = (cell.clientWidth / 2) - (tooltip.clientWidth / 2) + "px";
  })

  return (
    <td ref={cell} style={style} class="border border-neutral-600 size-10 relative">
      <div ref={tooltip} class="absolute text-center bg-neutral-50 text-sm px-2 py-1 rounded top-[-16px] opacity-0 z-50 pointer-events-none">
        {value?.toFixed(0) ?? '0'}
      </div>
    </td>
  )
}
