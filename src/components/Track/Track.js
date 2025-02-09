import React, { useRef, useState, useEffect } from "react";
import styles from "./Track.module.css";

function Track({ title, artist, album, audioUrl, onAdd, onRemove, isInPlaylist }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const updateCurrentTime = () => setCurrentTime(audio.currentTime);
            const setAudioDuration = () => setDuration(audio.duration);

            audio.addEventListener("timeupdate", updateCurrentTime);
            audio.addEventListener("loadedmetadata", setAudioDuration);

            return () => {
                audio.removeEventListener("timeupdate", updateCurrentTime);
                audio.removeEventListener("loadedmetadata", setAudioDuration);
            };
        }
    }, []);

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        return `${hours > 0 ? `${hours}:` : ""}${minutes < 10 && hours > 0 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    return (
        <div className={styles.track}>
            <h3>{title}</h3>
            <p>{artist} | {album}</p>

            {audioUrl && (
                <>
                    <button onClick={handlePlayPause}>
                        {isPlaying ? "⏸ Pause" : "▶ Play"}
                    </button>

                    <button onClick={handleStop}>⏹ Stop</button>

                    <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)}></audio>
                </>
            )}
            
            {isInPlaylist ? (
                <button onClick={onRemove}>×</button> 
            ) : (
                <button onClick={onAdd}>+</button>
            )}

            {duration > 0 && (
                <div>
                    <progress value={currentTime} max={duration}></progress>
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
            )}
        </div>
    );
}

export default Track;
