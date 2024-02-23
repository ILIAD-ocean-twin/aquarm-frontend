import { Accessor, Component, For } from "solid-js"
import { BasicWeek, ConnectivityData } from "./types"


interface MatrixProps {
    sites: Accessor<BasicWeek[]>,
    matrix: Accessor<ConnectivityData>
}

export const CorrelationMatrix: Component<MatrixProps> = (props) => {
    const rows = () => props.matrix().connectivity_matrix;

    return <Grid rows={rows()} />
}

const Grid: Component<{ rows: number[][] }> = (props) => {
    return <div class="">
        <For each={props.rows}>{r =>
            <GridRow values={r} />
        }</For>
    </div>
}

const GridRow: Component<{ values: number[] }> = ({ values }) => {
    return <div class="flex">
        <For each={values}>{v =>
            <GridCell value={v} />
        }</For>
    </div>
}

const GridCell: Component<{ value: number }> = ({ value }) => {
    const style = {
        background: `rgba(${value / 500000 * 255}, 20, 20, ${value > 50 ? 1 : 0})`
    }

    return <div style={style} class="border w-10 h-10" aria-label="sdfsdf" />
}