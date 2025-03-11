import React from "react";
import OreImg from "../../../../public/mithril-ore.webp"

const MithrilOreButton = ({ onMine, mithrilPerSecond, mithril }) => {
    return (
        <div className="d-flex flex-column align-items-center">
            <p className="text text-center mb-2 fw-bold">Mithril: {mithril}</p>
            <p className="text text-center mb-2 fw-light">Mithril per second: {mithrilPerSecond}</p>
            <img
                src={OreImg}
                onClick={onMine}
                alt=""
                className="img-fluid rounded w-16 h-16"
            />
        </div>
    )
}

export default MithrilOreButton;