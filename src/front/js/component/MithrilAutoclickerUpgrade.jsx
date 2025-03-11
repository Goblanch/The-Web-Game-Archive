import React from "react";

const MithrilAutoclickerUpgrade = ({ name, description, cost, OnUpgrade, disabled }) => {

    const handleClick = () => {
        if (!disabled) {
            OnUpgrade();
        }
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <button
                onClick={handleClick}
                className={`px-4 py-2 w-100 h-100 rounded ${disabled ? 'cursor-not-allowed' : 'btn-outline-secondary'}`}
                disabled={disabled}
                title={description}
            >
                {name} (Cost: {cost})
            </button>
        </div>

    )
}

export default MithrilAutoclickerUpgrade;