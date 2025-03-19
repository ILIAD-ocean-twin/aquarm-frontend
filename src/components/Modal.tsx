import { ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";

interface ModalProps {
    onClose: () => void
}

export const Modal: ParentComponent<ModalProps> = (props) => {
    return (
        <Portal>
            <div
                onClick={props.onClose}
                style={{ "z-index": 1000 }}
                class="bg-black/60 w-screen h-screen w-screen top-0 left-0 overflow-hidden absolute flex items-center cursor-pointer">
                <div
                    onClick={ev => ev.stopPropagation()}
                    class="w-[32rem] min-h-64 px-6 py-5 bg-white rounded-lg mx-auto cursor-default pointer-events-auto"
                >
                    {props.children}
                </div>
            </div>
        </Portal>
    )
}