import { createEffect } from "@lincode/reactivity"
import mainCamera from "../../engine/mainCamera"
import { onBeforeRender } from "../../events/onBeforeRender"
import IThirdPersonCamera, {
    thirdPersonCameraDefaults,
    thirdPersonCameraSchema
} from "../../interface/IThirdPersonCamera"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getEditorMounted } from "../../states/useEditorMounted"
import { getEditorPlay } from "../../states/useEditorPlay"
import CharacterCamera from "../core/CharacterCamera"
import MeshItem from "../core/MeshItem"
import fpsAlpha from "../utils/fpsAlpha"
import getWorldDirection from "../utils/getWorldDirection"
import getWorldPosition from "../utils/getWorldPosition"
import getWorldQuaternion from "../utils/getWorldQuaternion"
import { point2Vec } from "../utils/vec2Point"

const setVisible = (target: MeshItem, visible: boolean) => {
    "visible" in target && (target.visible = visible)
}

let alwaysVisible = false

createEffect(() => {
    alwaysVisible =
        !getEditorPlay() ||
        (getEditorMounted() && getCameraRendered() === mainCamera)
}, [getEditorMounted, getEditorMounted, getCameraRendered])

export default class ThirdPersonCamera
    extends CharacterCamera
    implements IThirdPersonCamera
{
    public static componentName = "thirdPersonCamera"
    public static override defaults = thirdPersonCameraDefaults
    public static override schema = thirdPersonCameraSchema

    public constructor() {
        super()
        this.innerZ = 300
        this.orbitMode = true

        const cam = this.camera

        this.createEffect(() => {
            const found = this.foundState.get()
            if (!found) {
                const handle = onBeforeRender(() => {
                    cam.position.copy(getWorldPosition(this.object3d))
                    cam.quaternion.copy(getWorldQuaternion(this.object3d))
                })
                return () => {
                    handle.cancel()
                }
            }

            let tooCloseOld = true
            setVisible(found, !tooCloseOld)

            let first = true
            const handle = onBeforeRender(() => {
                const origin = getWorldPosition(this.outerObject3d)
                const position = getWorldPosition(this.object3d)
                const direction = getWorldDirection(this.object3d)
                //mark

                // cam.position.lerp(position, first ? 1 : fpsAlpha(0.1))
                cam.position.copy(position)
                cam.quaternion.copy(getWorldQuaternion(this.object3d))

                const tooClose = alwaysVisible
                    ? false
                    : cam.position.distanceTo(origin) < 1
                tooClose !== tooCloseOld && setVisible(found, !tooClose)
                tooCloseOld = tooClose

                first = false
            })
            return () => {
                handle.cancel()
            }
        }, [this.foundState.get])
    }
}
