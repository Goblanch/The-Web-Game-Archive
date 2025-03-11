import React, { useState, useEffect } from 'react';

import MithrilAutoclickerUpgrade from './component/MithrilAutoclickerUpgrade.jsx';
import MithrilOreButton from './component/MithrilOreButton.jsx';
import MithtrilUpgradeList from './component/MithrilUpgradeList.jsx';
import MithrilInventory from './component/MithrilInventory.jsx';

// TODO: arreglar la imagen de los items comprados
// TODO: que cuando haya muchos items del mismo salga el mismo item con un número de cuántos hay.
// TODO: Gestionar cuándo el usuario sale del juego para cargar los datos a la DB
// TODO: actualizar puntos en la database cada X tiempo para evitar pérdida de puntos.

const MithrilAutoclicker = () => {
    const [mithril, setMithril] = useState(0);
    const [mithrilPerClick, setMithrilPerClick] = useState(1);
    const [autoClickers, setAutoClickers] = useState(0);
    const [purchasedUpgrades, setPurchasedUpgrades] = useState([]);

    const upgrades = [
        {
            name: "Mithril Pickaxe",
            description: "A pickaxe forged from mithril, increasing mithril per click by 2.",
            cost: 10,
            onUpgrade: () => setMithrilPerClick((prev) => prev + 2),
        },
        {
            name: "Mithril Forge",
            description: "Automates mithril extraction, generating 5 mithril per second.",
            cost: 50,
            onUpgrade: () => setAutoClickers((prev) => prev + 5),
        },
        {
            name: "Mithril Armor",
            description: "Enhances mining efficiency, increasing mithril per click by 5.",
            cost: 100,
            onUpgrade: () => setMithrilPerClick((prev) => prev + 5),
        },
        {
            name: "Mithril Vein Detector",
            description: "Detect hidden mithril veins, doubling mithril per second.",
            cost: 200,
            onUpgrade: () => setAutoClickers((prev) => prev * 2),
        },
        {
            name: "Elven Blessing",
            description: "Blessings of the Elves increase mithril per click by 10.",
            cost: 1000,
            onUpgrade: () => setMithrilPerClick((prev) => prev + 10),
        },
    ];

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

    const handleUpgradePurchase = (upgrade) => {
        if (mithril >= upgrade.cost) {
            setMithril(mithril - upgrade.cost);
            setPurchasedUpgrades((prev) => [...prev, { name: upgrade.name, image: upgrade.image }]);
            upgrade.onUpgrade();
        }
    };

    return (
        <div className='container mt-4'>
            <div className='row'>
                <div className='col-3'>
                    <MithrilOreButton
                        onMine={handleMineClick}
                        mithrilPerSecond={autoClickers}
                        mithril={mithril}
                    />
                </div>

                <div className='col-6'>
                    <MithrilInventory items={purchasedUpgrades} />
                </div>

                <div className='col-3'>
                    <MithtrilUpgradeList>
                        {upgrades.map((upgrade, index) => (
                            <MithrilAutoclickerUpgrade
                                key={index}
                                name={upgrade.name}
                                description={upgrade.description}
                                cost={upgrade.cost}
                                OnUpgrade={() => handleUpgradePurchase(upgrade)}
                                disabled={mithril < upgrade.cost}
                            />
                        ))}
                    </MithtrilUpgradeList>
                </div>
            </div>

        </div>
    );
};

export default MithrilAutoclicker;
