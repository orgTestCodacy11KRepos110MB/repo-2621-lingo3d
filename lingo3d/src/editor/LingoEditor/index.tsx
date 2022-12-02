import Toolbar from "../Toolbar"
import SceneGraph from "../SceneGraph"
import Editor from "../Editor"
import Library from "../Library"
import HUD from "../HUD"
import { useEffect, useRef } from "preact/hooks"
import settings from "../../api/settings"
import Stats from "../Stats"
import Tabs from "../Tabs"
import Panels from "../Panels"
import { DEBUG } from "../../globals"
import useSyncState from "../hooks/useSyncState"
import { getFileCurrent } from "../../states/useFileCurrent"
import { getStats } from "../../states/useStats"

const LingoEditor = () => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (el) settings.autoMount = el
    }, [])

    const fileCurrent = useSyncState(getFileCurrent)
    const stats = useSyncState(getStats)

    return (
        <div
            className="lingo3d-ui lingo3d-lingoeditor lingo3d-absfull"
            onContextMenu={DEBUG ? undefined : (e) => e.preventDefault()}
        >
            <Toolbar />
            <SceneGraph />
            <Editor />
            <Library />
            <Panels />
            {fileCurrent && <Tabs />}
            {stats && <Stats />}
            <HUD />
            <div
                className="lingo3d-world"
                ref={elRef}
                style={{ height: "100%", flexGrow: 1, position: "relative" }}
            />
        </div>
    )
}
export default LingoEditor
