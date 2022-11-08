import register from "preact-custom-element"
import AppBar from "../component/AppBar"
import CloseableTab from "../component/CloseableTab"
import { useFileCurrent } from "../states"
import useInitCSS from "../utils/useInitCSS"

const Tabs = () => {
    useInitCSS(true)
    const [fileCurrent] = useFileCurrent()

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-tabs"
            style={{ width: "100%" }}
        >
            <AppBar>
                <CloseableTab>{fileCurrent?.name ?? "untitled"}</CloseableTab>
            </AppBar>
        </div>
    )
}
export default Tabs

register(Tabs, "lingo3d-tabs")