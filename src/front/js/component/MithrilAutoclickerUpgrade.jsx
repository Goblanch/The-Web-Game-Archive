import React from "react";

const MithrilAutoclickerUpgrade = ({ name, description, cost, OnUpgrade, disabled }) => {

    const handleClick = () => {
        if (!disabled) {
            OnUpgrade();
        }
    }

    return (
        <button
            onClick={handleClick}
            className={`px-4 py-2 rounded ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-700'}`}
            disabled={disabled}
            title={description}
        >
            {name} (Cost: {cost})
        </button>
    )
}

export default MithrilAutoclickerUpgrade;