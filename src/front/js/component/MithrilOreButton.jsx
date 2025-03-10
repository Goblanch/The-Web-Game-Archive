import React from "react";
import OreImg from "../../../../public/mithril-ore.webp"

const MithrilOreButton = ({ onMine }) => {
    return (
        <img src={OreImg} onClick={onMine} alt="" className="w-16 h-16" />
    )
}

export default MithrilOreButton;