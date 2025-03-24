import React, { useState, useEffect } from 'react';

import MithrilAutoclickerUpgrade from './component/MithrilAutoclickerUpgrade.jsx';
import MithrilOreButton from './component/MithrilOreButton.jsx';
import MithtrilUpgradeList from './component/MithrilUpgradeList.jsx';
import MithrilInventory from './component/MithrilInventory.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createNewPlayedGame,addTotalPoints } from '../services/APIServices.js';

// TODO: arreglar la imagen de los items comprados

const MithrilAutoclicker = () => {
    const [mithril, setMithril] = useState(0);
    const [mithrilPerClick, setMithrilPerClick] = useState(1);
    const [autoClickers, setAutoClickers] = useState(0);
    const [purchasedUpgrades, setPurchasedUpgrades] = useState([]);

    const navigate = useNavigate();

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

    ///// Evento para salir del juego y guardar las Partidas Jugadas y Total Points
    const handleGameOver = () => {

         //Llamada a la API para guardar las partida y los Total Points
        const isLogin = sessionStorage.getItem("token")

        if(isLogin){

            const mithrilClicker = {
                user_id: sessionStorage.getItem("id_user"),
                minigame_id: 4,
                game_data: "Informacion sobre la partida de Mithril Clicker",
                game_points: mithril,
                record: null,
                mithril_per_second: null


            }
            
            createNewPlayedGame(mithrilClicker)

            addTotalPoints(mithril,sessionStorage.getItem("id_user"))

            console.log("Se ha subido tu partida");

        }else{
        
            return Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: `Debes logearte para poder guardar tus partidas`,
                          });    
                    
        }  

        navigate("/") 
    }


    useEffect(() => {
        if (autoClickers > 0) {
            const interval = setInterval(() => {
                setMithril((prevMithril) => prevMithril + autoClickers);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [autoClickers]);

    useEffect(() => {
        const updateToBackEnd = () => {
            // Añadir aquí la lógica para actualizar puntos cada x segundos
            console.log("Updating mithril data to backend")
        };

        const interval = setInterval(updateToBackEnd, 30000);

        const handleBeforeUnload = (event) => {
            // Añadir aquí lógica para actualizar backend cuándo se sale del juego
            console.log("Cerrando navegador. Actualizando backend");
        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, [])


    return (
        <div className='container mt-4'>
            <div className='row'>
                <div className='col-12 col-lg-3'>
                    <MithrilOreButton
                        onMine={handleMineClick}
                        mithrilPerSecond={autoClickers}
                        mithril={mithril}
                    />
                </div>

                <div className='col-12 col-lg-6 mt-4 mt-lg-0 order-2 order-lg-1'>
                    <MithrilInventory items={purchasedUpgrades} />
                </div>

                <div className='col-12 col-lg-3 mt-4 mt-lg-0 order-1 order-lg-2'>
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
            <button type="button" onClick={handleGameOver} class="btn btn-danger m-2">Guardar partida y cerrar</button>
        </div>
    );
};

export default MithrilAutoclicker;
