import React from "react";
import styles from "./SearchResults.module.css";
import Tracklist from "../Tracklist/Tracklist";

function SearchResults({ tracks, onAdd }) {  // Accept `onAdd`
    return (
        <div className={styles.searchResults}>
            <h2>Search Results</h2>
            {tracks === null ? null : tracks.length > 0 ? (
                <Tracklist tracks={tracks} onAdd={onAdd} />
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
}

export default SearchResults;
