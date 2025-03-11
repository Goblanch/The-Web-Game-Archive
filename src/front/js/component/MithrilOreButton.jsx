import React from "react";
import OreImg from "../../../../public/mithril-ore.webp"

const MithrilOreButton = ({ onMine, mithrilPerSecond, mithril }) => {
    return (
        <div className="flex flex-col items-center">
            <p className="text-lg mb-2">Mithril: {mithril}</p>
            <p className="text-lg mb-2">Mithril per second: {mithrilPerSecond}</p>
            <img src={OreImg} onClick={onMine} alt="" className="w-16 h-16" />
        </div>
    )
}

export default MithrilOreButton;