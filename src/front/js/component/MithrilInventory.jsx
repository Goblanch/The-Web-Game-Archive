import React from "react";
import picaxe from "../../../../public/picaxe.png"

const MithrilInventory = ({ items }) => {
    return (
        <div className="flex-1 bg-gray-200 p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Purchased Upgrades</h2>
            <div className="grid grid-cols-3 gap-2">
                {items.map((item, index) => (
                    <img
                        key={index}
                        src={picaxe}
                        alt={item.name}
                        className="w-12 h-12 border border-gray-400 rounded w-25 h-25"
                        title={item.name}
                    />
                ))}
            </div>
        </div>
    );
}

export default MithrilInventory;