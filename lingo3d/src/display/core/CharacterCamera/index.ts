import { Object3D, PerspectiveCamera, Quaternion } from "three"
import scene from "../../../engine/scene"
import { onBeforeRender } from "../../../events/onBeforeRender"
import ICharacterCamera, {
    characterCameraDefaults,
    characterCameraSchema,
    LockTargetRotationValue
} from "../../../interface/ICharacterCamera"
import { getSelectionTarget } from "../../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../../states/useTransformControlsDragging"
import OrbitCameraBase from "../OrbitCameraBase"
import { euler, quaternion } from "../../utils/reusables"
import MeshItem from "../MeshItem"
import { getLoadedObject } from "../Loaded"
import getWorldQuaternion from "../../utils/getWorldQuaternion"
import { getEditorModeComputed } from "../../../states/useEditorModeComputed"
import characterCameraPlaced from "./characterCameraPlaced"
import { FAR, NEAR } from "../../../globals"
import { getCentripetal } from "../../../states/useCentripetal"
import applyCentripetalQuaternion from "../../utils/applyCentripetalQuaternion"
import fpsAlpha from "../../utils/fpsAlpha"
import { positionChanged } from "../../utils/trackObject"

export default class CharacterCamera
    extends OrbitCameraBase
    implements ICharacterCamera
{
    public static defaults = characterCameraDefaults
    public static schema = characterCameraSchema

    public constructor() {
        super(new PerspectiveCamera(75, 1, NEAR, FAR))

        const midObject3d = (this.midObject3d = new Object3D())
        this.outerObject3d.add(midObject3d)
        midObject3d.add(this.object3d)

        const cam = this.camera
        scene.attach(cam)
        this.then(() => scene.remove(cam))

        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            if ("frustumCulled" in target) target.frustumCulled = false
        }, [this.targetState.get])

        const followTargetRotation = (target: MeshItem, slerp: boolean) => {
            euler.setFromQuaternion(target.outerObject3d.quaternion)
            euler.y += Math.PI

            if (slerp) {
                quaternion.setFromEuler(euler)
                midObject3d.quaternion.slerp(quaternion, fpsAlpha(0.1))
            } else midObject3d.setRotationFromEuler(euler)

            this.updateAngle()
        }

        const lockTargetRotation = (
            target: MeshItem,
            slerp: boolean,
            quat: Quaternion | undefined
        ) => {
            euler.setFromQuaternion(this.midObject3d.quaternion)
            euler.x = 0
            euler.z = 0
            euler.y += Math.PI

            if (quat) {
                const innerObject = getLoadedObject(target)
                quaternion.copy(target.outerObject3d.quaternion)
                const innerRotationY = innerObject.rotation.y

                target.outerObject3d.quaternion.copy(quat)
                innerObject.rotation.y = euler.y
                euler.setFromQuaternion(getWorldQuaternion(innerObject))

                innerObject.rotation.y = innerRotationY
                target.outerObject3d.quaternion.copy(quaternion)
            }

            const placed = characterCameraPlaced.has(target)
            if (slerp && !placed) {
                quaternion.setFromEuler(euler)
                target.outerObject3d.quaternion.slerp(quaternion, fpsAlpha(0.1))
                return
            }
            target.outerObject3d.setRotationFromEuler(euler)
            quat && placed && characterCameraPlaced.delete(target)
        }

        let transformControlRotating = false

        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            followTargetRotation(target, false)

            const centripetal = getCentripetal()

            const handle = onBeforeRender(() => {
                this.outerObject3d.position.copy(target.outerObject3d.position)

                const quat = centripetal
                    ? applyCentripetalQuaternion(this)
                    : undefined

                if (!this.lockTargetRotation) return

                if (
                    this.lockTargetRotation === "follow" ||
                    transformControlRotating
                ) {
                    followTargetRotation(target, false)
                    return
                }
                if (this.lockTargetRotation === "dynamic-lock") {
                    positionChanged(target.outerObject3d) &&
                        lockTargetRotation(target, true, quat)
                    return
                }
                if (this.lockTargetRotation === "dynamic-follow") {
                    positionChanged(target.outerObject3d) &&
                        followTargetRotation(target, true)
                    return
                }
                lockTargetRotation(target, false, quat)
            })
            return () => {
                handle.cancel()
            }
        }, [this.targetState.get, getCentripetal])

        this.createEffect(() => {
            const target = this.targetState.get()
            const selectionTarget = getSelectionTarget()
            const dragging = getTransformControlsDragging()
            const mode = getEditorModeComputed()

            const rotating =
                target &&
                target === selectionTarget &&
                dragging &&
                mode === "rotate"
            if (!rotating) return

            transformControlRotating = true

            return () => {
                transformControlRotating = false
            }
        }, [
            this.targetState.get,
            getSelectionTarget,
            getTransformControlsDragging,
            getEditorModeComputed
        ])
    }

    public lockTargetRotation: LockTargetRotationValue = true
}
