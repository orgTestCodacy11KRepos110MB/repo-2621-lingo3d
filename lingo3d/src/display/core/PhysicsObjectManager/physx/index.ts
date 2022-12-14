import { lazy } from "@lincode/utils"
//@ts-ignore
import PhysX from "physx-js-webidl"
import { setPhysX } from "../../../../states/usePhysX"
import "./physxLoop"

PhysX().then(
    ({
        PxTopLevelFunctions,
        PxDefaultAllocator,
        PxDefaultErrorCallback,
        PxTolerancesScale,
        PxCookingParams,
        PxConvexFlags,
        _emscripten_enum_PxConvexFlagEnum_eCOMPUTE_CONVEX,
        _emscripten_enum_PxConvexFlagEnum_eDISABLE_MESH_VALIDATION,
        _emscripten_enum_PxConvexFlagEnum_eFAST_INERTIA_COMPUTATION,
        PxVec3,
        PxSceneDesc,
        PxShapeFlags,
        _emscripten_enum_PxShapeFlagEnum_eSCENE_QUERY_SHAPE,
        _emscripten_enum_PxShapeFlagEnum_eSIMULATION_SHAPE,
        PxTransform,
        _emscripten_enum_PxIDENTITYEnum_PxIdentity,
        PxFilterData,
        PxBoxGeometry,
        PxCapsuleGeometry,
        PxConvexMeshDesc,
        PxConvexMeshGeometry,
        PxRigidActorExt,
        Vector_PxVec3,
        PxBoundedData,
        Vector_PxU32,
        PxTriangleMeshDesc,
        PxTriangleMeshGeometry,
        PxQuat,
        PxCapsuleControllerDesc,
        _emscripten_enum_PxCapsuleClimbingModeEnum_eEASY,
        _emscripten_enum_PxCapsuleClimbingModeEnum_eCONSTRAINED,
        _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_CAN_RIDE_ON_OBJECT,
        _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_SLIDE,
        _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_USER_DEFINED_RIDE,
        _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_SIDES,
        _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_UP,
        _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_DOWN,
        _emscripten_enum_PxControllerNonWalkableModeEnum_ePREVENT_CLIMBING,
        _emscripten_enum_PxControllerNonWalkableModeEnum_ePREVENT_CLIMBING_AND_FORCE_SLIDING,
        _emscripten_enum_PxControllerShapeTypeEnum_eBOX,
        _emscripten_enum_PxControllerShapeTypeEnum_eCAPSULE
    }: any) => {
        const Px = PxTopLevelFunctions.prototype

        // create PxFoundation
        const version = Px.PHYSICS_VERSION
        const allocator = new PxDefaultAllocator()
        const errorCb = new PxDefaultErrorCallback()
        const foundation = Px.CreateFoundation(version, allocator, errorCb)

        //create PxPhysics
        const scale = new PxTolerancesScale()
        const physics = Px.CreatePhysics(version, foundation, scale)

        //init extensions
        Px.InitExtensions(physics)

        //create PxCooking
        const cookingParams = new PxCookingParams(scale)
        cookingParams.suppressTriangleMeshRemapTable = true
        const cooking = Px.CreateCooking(version, foundation, cookingParams)

        //create default convex flags
        const convexFlags = new PxConvexFlags(
            _emscripten_enum_PxConvexFlagEnum_eCOMPUTE_CONVEX() |
                _emscripten_enum_PxConvexFlagEnum_eDISABLE_MESH_VALIDATION() |
                _emscripten_enum_PxConvexFlagEnum_eFAST_INERTIA_COMPUTATION()
        )

        //create insertion callback
        const insertionCallback = physics.getPhysicsInsertionCallback()

        // create scene
        const pxVec = new PxVec3(0, -9.81, 0)
        const sceneDesc = new PxSceneDesc(scale)
        sceneDesc.set_gravity(pxVec)
        sceneDesc.set_cpuDispatcher(Px.DefaultCpuDispatcherCreate(0))
        sceneDesc.set_filterShader(Px.DefaultFilterShader())
        const scene = physics.createScene(sceneDesc)

        // create a default material
        const material = physics.createMaterial(0.5, 0.5, 0.5)
        // create default simulation shape flags
        const shapeFlags = new PxShapeFlags(
            _emscripten_enum_PxShapeFlagEnum_eSCENE_QUERY_SHAPE() |
                _emscripten_enum_PxShapeFlagEnum_eSIMULATION_SHAPE()
        )

        // create a few temporary objects used during setup
        const pxPose = new PxTransform(
            _emscripten_enum_PxIDENTITYEnum_PxIdentity()
        )
        const pxFilterData = new PxFilterData(1, 1, 0, 0)
        const pxQuat = new PxQuat(0, 0, 0, 1)

        // create PxController
        const controllerManager = Px.CreateControllerManager(scene)

        const PxCapsuleClimbingModeEnum = {
            eEASY: lazy(() =>
                _emscripten_enum_PxCapsuleClimbingModeEnum_eEASY()
            ),
            eCONSTRAINED: lazy(() =>
                _emscripten_enum_PxCapsuleClimbingModeEnum_eCONSTRAINED()
            )
        }
        const PxControllerBehaviorFlagEnum = {
            eCCT_CAN_RIDE_ON_OBJECT: lazy(() =>
                _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_CAN_RIDE_ON_OBJECT()
            ),
            eCCT_SLIDE: lazy(() =>
                _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_SLIDE()
            ),
            eCCT_USER_DEFINED_RIDE: lazy(() =>
                _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_USER_DEFINED_RIDE()
            )
        }
        const PxControllerCollisionFlagEnum = {
            eCOLLISION_SIDES: lazy(() =>
                _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_SIDES()
            ),
            eCOLLISION_UP: lazy(() =>
                _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_UP()
            ),
            eCOLLISION_DOWN: lazy(() =>
                _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_DOWN()
            )
        }
        const PxControllerNonWalkableModeEnum = {
            ePREVENT_CLIMBING: lazy(() =>
                _emscripten_enum_PxControllerNonWalkableModeEnum_ePREVENT_CLIMBING()
            ),
            ePREVENT_CLIMBING_AND_FORCE_SLIDING: lazy(() =>
                _emscripten_enum_PxControllerNonWalkableModeEnum_ePREVENT_CLIMBING_AND_FORCE_SLIDING()
            )
        }
        const PxControllerShapeTypeEnum = {
            eBOX: lazy(() => _emscripten_enum_PxControllerShapeTypeEnum_eBOX()),
            eCAPSULE: lazy(() =>
                _emscripten_enum_PxControllerShapeTypeEnum_eCAPSULE()
            )
        }

        setPhysX({
            physics,
            material,
            shapeFlags,
            pxVec,
            pxPose,
            pxFilterData,
            scene: scene,
            cooking,
            convexFlags,
            insertionCallback,
            PxBoxGeometry,
            PxCapsuleGeometry,
            PxConvexMeshDesc,
            PxConvexMeshGeometry,
            PxRigidActorExt,
            Vector_PxVec3,
            PxBoundedData,
            Vector_PxU32,
            PxTriangleMeshDesc,
            PxTriangleMeshGeometry,
            pxQuat,
            controllerManager,
            PxCapsuleControllerDesc,
            PxCapsuleClimbingModeEnum,
            PxControllerBehaviorFlagEnum,
            PxControllerCollisionFlagEnum,
            PxControllerNonWalkableModeEnum,
            PxControllerShapeTypeEnum
        })

        // scene.release()
        // material.release()
        // physics.release()
        // foundation.release()
        // cooking.release()
        // destroy(errorCb)
        // destroy(allocator)
        // console.log("Cleaned up")
    }
)
