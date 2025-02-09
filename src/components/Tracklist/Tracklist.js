import React from "react";
import styles from "./Tracklist.module.css";
import Track from "../Track/Track";

function Tracklist({ tracks, onAdd, onRemove }) {
    return (
        <div className={styles.tracklist}>
            {tracks.map((track) => (
                <Track
                    key={track.id}
                    title={track.title}
                    artist={track.artist}
                    album={track.album}
                    audioUrl={track.audioUrl}
                    onAdd={onAdd ? () => onAdd(track) : null}  // Only pass if `onAdd` exists
                    onRemove={onRemove ? () => onRemove(track) : null}  // Only pass if `onRemove` exists
                    isInPlaylist={!!onRemove}  // If `onRemove` exists, it's in playlist
                />
            ))}
        </div>
    );
}

export default Tracklist;
