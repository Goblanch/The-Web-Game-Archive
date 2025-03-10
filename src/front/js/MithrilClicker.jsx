import React, { useState, useEffect } from 'react';

import MithrilAutoclickerUpgrade from './component/MithrilAutoclickerUpgrade.jsx';
import MithrilOreButton from './component/MithrilOreButton.jsx';

const MithrilAutoclicker = () => {
    const [mithril, setMithril] = useState(0);
    const [mithrilPerClick, setMithrilPerClick] = useState(1);
    const [autoClickers, setAutoClickers] = useState(0);

    useEffect(() => {
        if (autoClickers > 0) {
            const interval = setInterval(() => {
                setMithril((prevMithril) => prevMithril + autoClickers);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [autoClickers]);

    const handleMineClick = () => {
        setMithril(mithril + mithrilPerClick);
    };

    const handleUpgradeClick = () => {
        const upgradeCost = mithrilPerClick * 10;
        if (mithril >= upgradeCost) {
            setMithril(mithril - upgradeCost);
            setMithrilPerClick(mithrilPerClick + 1);
        } else {
            alert('Not enough mithril for upgrade!');
        }
    };

    const handleAutoClickerPurchase = () => {
        const autoClickerCost = (autoClickers + 1) * 50;
        if (mithril >= autoClickerCost) {
            setMithril(mithril - autoClickerCost);
            setAutoClickers(autoClickers + 1);
        } else {
            alert('Not enough mithril for auto-clicker!');
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <h1 className="text-2xl font-bold">Mithril Autoclicker</h1>
            <p className="text-lg">Mithril: {mithril}</p>
            <MithrilOreButton onMine={handleMineClick} />
            {/* <button onClick={handleMineClick} className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">
                Mine Mithril
            </button> */}
            <div className="flex gap-4">
                <MithrilAutoclickerUpgrade
                    name="Upgrade Pickaxe"
                    description="Increase mithril per click by 1."
                    cost={mithrilPerClick * 10}
                    OnUpgrade={handleUpgradeClick}
                    disabled={mithril < mithrilPerClick * 10}
                />
                <MithrilAutoclickerUpgrade
                    name="Buy Auto-clicker"
                    description="Automatically generate 1 mithril per second."
                    cost={(autoClickers + 1) * 50}
                    OnUpgrade={handleAutoClickerPurchase}
                    disabled={mithril < (autoClickers + 1) * 50}
                />
            </div>
        </div>
    );
};

export default MithrilAutoclicker;
