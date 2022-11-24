import { useTimelineData } from "../states/useTimelineData"
import LayerTreeItem from "./LayerTreeItem"
import PropertyTreeItem from "./PropertyTreeItem"

const TimelineGraph = () => {
    const [[timelineData]] = useTimelineData()

    return (
        <div className="lingo3d-absfull" style={{ overflow: "scroll" }}>
            {timelineData &&
                Object.entries(timelineData).map(([uuid, data]) => (
                    <LayerTreeItem key={uuid} uuid={uuid}>
                        {Object.keys(data).map((property) => (
                            <PropertyTreeItem
                                key={uuid + " " + property}
                                property={property}
                                uuid={uuid}
                            />
                        ))}
                    </LayerTreeItem>
                ))}
        </div>
    )
}

export default TimelineGraph
