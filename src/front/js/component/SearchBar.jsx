import React, { useState } from "react";

const SearchBar = ({ names, onSelect }) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value)

        if (value.trim() === "") {
            setSuggestions([]);
        } else {
            const filteredSuggestions = names.filter((name) =>
                name.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions.slice(0, 10));
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setSuggestions([]);
        onSelect(suggestion);
    }

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Who's that Pokémon..."
            />
            {suggestions.length > 0 && (
                <ul className="absolute w-full bg-white border rounded-md shadow-md max-h-40 overflow-y-auto mt-1 z-10 list-group">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer list-group-item"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;