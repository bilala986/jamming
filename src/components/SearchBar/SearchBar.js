import React, { useState } from "react";
import styles from "./SearchBar.module.css";

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");
    
    const handleChange = (event) => {
        setQuery(event.target.value);
    }
    
    const handleSearch = () => {
        if (query.trim() !== "") {
            onSearch(query);
        }
    }
    
    return (
        <div className={styles.searchBar}>
            <input 
                type="text"
                placeholder="Search for a recitation..."
                value={query}
                onChange={handleChange}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    )
}

export default SearchBar;