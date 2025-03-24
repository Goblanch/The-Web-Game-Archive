import React, { useState } from "react";
import picaxe from "../../../../public/picaxe.png"
import MithrilUpgradeItem from "./MithrilUpgradeItem.jsx";

const MithrilInventory = ({ items }) => {

    const itemCounts = items.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
    }, {});

    const groupedItems = Object.entries(itemCounts).reduce((acc, [name, count]) => {
        const item = items.find((i) => i.name === name); 

        if (item) {
            if (count >= 4) {
                acc.push({ name, count, image: item.image });
            } else {
                for (let i = 0; i < count; i++) {
                    acc.push({ name, count: 1, image: item.image });
                }
            }
        }

        return acc;
    }, []);

    return (
        <div className="flex-1 bg-light p-4 rounded shadow">
            <h2 className="fs-4 mb-4">Purchased Upgrades</h2>
            <div className="row g-2">
                {groupedItems.map((item, index) => (
                    <div className="col-3" key={index}>
                        <MithrilUpgradeItem item={item} count={item.count} image={item.image} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MithrilInventory;