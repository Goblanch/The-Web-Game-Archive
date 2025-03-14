import React, { useEffect, useState, useContext } from "react";
import { Context } from "./store/appContext";

import MinigameRulesModal from "./component/MinigameRulesModal.jsx";

const FairPrice = () => {

    const { store, actions } = useContext(Context);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userGuess, setUserGuess] = useState("");
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState("");

    const getRandomProduct = () => {
        const products = store.fakeStoreProducts;
        if (products && products.length > 0) {
            const randomIndex = Math.floor(Math.random() * products.length);
            setProduct(products[randomIndex]);
            setLoading(false);  // Finaliza el loading
            setMessage("");
        }
    }

    const handleUserGuess = (e) => {
        e.preventDefault();
        const userPrice = parseFloat(userGuess);
        const actualPrice = product.price;

        if (isNaN(userPrice) || userPrice <= 0) {
            setMessage("Please enter a valid number");
            return;
        }

        const priceDifference = Math.abs(userPrice - actualPrice);

        let roundScore = 0;

        if (priceDifference === 0) {
            roundScore = 100;
            setMessage("Perfect guess! You got the price right!");
        } else if (priceDifference <= actualPrice * 0.1) {
            roundScore = 80;
            setMessage("Very close! You got it within 10%.");
        } else if (priceDifference <= actualPrice * 0.2) {
            roundScore = 50;
            setMessage("Good guess! You were within 20%.");
        } else {
            roundScore = 20;
            setMessage("Quite far");
        }

        setScore(prevScore => prevScore + roundScore);

        setTimeout(() => {
            getRandomProduct();
            setUserGuess("");
        }, 2000)
    }

    useEffect(() => {
        const fetchProducts = async () => {
            await actions.getStoreProducts()
        }
        fetchProducts();
    }, [])

    useEffect(() => {
        if (store.fakeStoreProducts.length > 0) {
            getRandomProduct();
        }
    }, [store.fakeStoreProducts]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <MinigameRulesModal gameName={"fair-price"} />
            <h2>Fair Price</h2>
            {product && (
                <div className="d-flex flex-column align-items-center">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="img-fluid h-25 w-25 mb-3 me-3"
                    />
                    
                    <h3 className="text text-center mb-3">{product.title}</h3>
                    {
                        message ? <h3 className="text fw-semibold border border-success rounded p-2 mb-3">Price: {product.price} $</h3> : 
                        <h3 className="text fw-semibold border border-warning rounded p-2 mb-3">Price: ???</h3>
                    }
                    {/* <p>Price: ${product.price}</p> */}
                    <form onSubmit={handleUserGuess} className="d-flex mb-2">
                        <input
                            type="number"
                            value={userGuess}
                            onChange={(e) => setUserGuess(e.target.value)}
                            placeholder="Enter your guess"
                            min="0"
                            step="0.01"
                            className="form-control me-2"
                        />
                        <input type="submit" value="Guess" className="btn btn-warning" />
                    </form>
                    {message && <p>{message}</p>}
                    <p className="text fw-bold">Your score: {score}</p>
                </div>
            )}
        </div>
    );
}

export default FairPrice;