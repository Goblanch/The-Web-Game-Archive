import React, { Children } from "react";

const MithtrilUpgradeList = ({ children }) => {
    return (
        <div className="flex-1 overflow-y-auto max-h-screen bg-gray-100 p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Available Upgrades</h2>
            <div className="flex flex-col gap-4">
                {children}
            </div>
        </div>
    );
}

export default MithtrilUpgradeList;