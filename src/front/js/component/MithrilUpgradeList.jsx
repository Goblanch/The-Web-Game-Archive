import React, { Children } from "react";

const MithtrilUpgradeList = ({ children }) => {
    return (
        <div className="flex-1 overflow-y-auto max-h-screen bg-gray-100 p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Mithril Shop</h2>
            <div className="row g-4">
                {React.Children.map(children, (child) => (
                    <div className="col-12">{child}</div>
                ))}
            </div>
        </div>
    );
}

export default MithtrilUpgradeList;