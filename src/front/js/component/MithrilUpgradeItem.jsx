import React from "react";
import picaxe from "../../../../public/picaxe.png"

const MithrilUpgradeItem = ({ item, count }) => {
    return (
        <div>
            <img
                src={picaxe}
                alt={item.name}
                className="border border-gray-400 rounded w-75 h-75"
                title={item.name}
            />
            {count > 1 && (
                // <span className="mb-0 me-0 bg-gray-800 text-xs rounded full px-1">
                //     {count}
                // </span>
                <p className="text-end me-3 pe-3 fw-bold">x{count}</p>
            )}
        </div>
    )
}

export default MithrilUpgradeItem;