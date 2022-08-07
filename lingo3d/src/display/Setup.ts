import Appendable from "../api/core/Appendable"
import ISetup, { setupDefaults, setupSchema } from "../interface/ISetup"
import getDefaultValue from "../interface/utils/getDefaultValue"
import {
    pullSetupStack,
    pushSetupStack,
    refreshSetupStack
} from "../states/useSetupStack"

class Setup extends Appendable implements ISetup {
    public static componentName = "setup"
    public static defaults = setupDefaults
    public static schema = setupSchema

    protected data: Partial<ISetup> = {}

    public constructor() {
        super()
        pushSetupStack(this)
        this.then(() => pullSetupStack(this))
    }
}
for (const key of Object.keys(setupSchema)) {
    Object.defineProperty(Setup.prototype, key, {
        get() {
            return this.data[key] ?? getDefaultValue(setupDefaults, key)
        },
        set(value) {
            this.data[key] =
                value === getDefaultValue(setupDefaults, key)
                    ? undefined
                    : value
            refreshSetupStack()
        }
    })
}
interface Setup extends Appendable, ISetup {}
export default Setup