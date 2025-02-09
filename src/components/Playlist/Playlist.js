import React, { useState } from "react";
import styles from "./Playlist.module.css";
import Tracklist from "../Tracklist/Tracklist";
import Spotify from "../Spotify/Spotify";

function Playlist({ tracks, onRemove, playlistName, setPlaylist, setPlaylistName }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(playlistName);

    const handleNameChange = (event) => {
        setTempName(event.target.value);  // Update temp name as user types
    };

    const handleSave = () => {
        if (tempName.trim().length === 0 || tracks.length === 0) {
            alert("Playlist must have a name and at least one track!");
            return;
        }

        const trackUris = tracks.map(track => track.uri);

        // Save to Spotify
        Spotify.savePlaylist(tempName, trackUris);

        // Update UI & Local Storage
        setPlaylist([]);
        setPlaylistName("");
        localStorage.removeItem("playlist");
        localStorage.removeItem("playlistName");
        setIsEditing(false);  // Exit editing mode
    };


    return (
        <div className={styles.playlist}>
            <h2>{playlistName || "'Your Playlist Name'"}</h2>  

            {/* Change Playlist Name Button */}
            {!isEditing ? (
                <button className={styles.changeBtn} onClick={() => setIsEditing(true)}>
                    Change Playlist Name
                </button>
            ) : (
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Enter your Playlist Name here..."
                        value={tempName}
                        onChange={handleNameChange}
                    />
                    <button
                        className={tempName.trim().length > 0 ? styles.activeSave : styles.disabledSave}
                        onClick={handleSave}
                        disabled={tempName.trim().length === 0}  // Disable if empty
                    >
                        Save
                    </button>
                </div>
            )}

            {tracks.length > 0 ? (
                <Tracklist tracks={tracks} onRemove={onRemove} />
            ) : (
                <p>No tracks added.</p>
            )}
        </div>
    );
}

export default Playlist;
