import { ShadowDistance } from "../states/useShadowDistance"
import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"

export default interface IDirectionalLight extends ILightBase {
    shadowDistance: Nullable<ShadowDistance>
}

export const directionalLightSchema: Required<ExtractProps<IDirectionalLight>> =
    {
        ...lightBaseSchema,
        shadowDistance: String
    }

export const shadowDistanceChoices = new Choices({
    near: "near",
    medium: "medium",
    far: "far"
})
export const directionalLightDefaults = extendDefaults<IDirectionalLight>(
    [lightBaseDefaults],
    { shadowDistance: nullableDefault("medium") },
    { shadowDistance: shadowDistanceChoices }
)
