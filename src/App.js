import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Playlist from "./components/Playlist/Playlist";
import Header from "./components/Header/Header";
import Spotify from "./components/Spotify/Spotify";

function App() {
    const [searchResults, setSearchResults] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [playlistName, setPlaylistName] = useState("");

    // Load playlist and playlist name from localStorage on mount
    useEffect(() => {
        const savedPlaylist = localStorage.getItem("playlist");
        const savedPlaylistName = localStorage.getItem("playlistName");

        if (savedPlaylist) {
            try {
                setPlaylist(JSON.parse(savedPlaylist)); // Parse JSON correctly
            } catch (error) {
                console.error("Error parsing playlist from localStorage:", error);
                setPlaylist([]); // Fallback to empty array if parsing fails
            }
        }

        if (savedPlaylistName) {
            setPlaylistName(savedPlaylistName);
        }
    }, []);

    // Save playlist & playlist name to localStorage whenever they change
    useEffect(() => {
        if (playlist.length > 0) {
            localStorage.setItem("playlist", JSON.stringify(playlist));
        }
        localStorage.setItem("playlistName", playlistName);
    }, [playlist, playlistName]);

    const handleSearch = async (term) => {
    if (!term.trim()) return;

    try {
        // Fetch Quran Chapters
        const quranResponse = await fetch("https://api.quran.com/api/v4/chapters");
        const quranData = await quranResponse.json();

        let quranResults = [];
        if (quranData.chapters) {
            const filteredResults = quranData.chapters.filter(chapter =>
                chapter.name_simple.toLowerCase().includes(term.toLowerCase()) ||
                chapter.translated_name.name.toLowerCase().includes(term.toLowerCase())
            );

            quranResults = await Promise.all(
                filteredResults.map(async (chapter) => {
                    const audioResponse = await fetch(
                        `https://api.quran.com/api/v4/chapter_recitations/1/${chapter.id}`
                    );
                    const audioData = await audioResponse.json();

                    return {
                        id: chapter.id,
                        title: chapter.name_simple,
                        artist: "Quran Recitation",
                        album: chapter.translated_name.name,
                        audioUrl: audioData.audio_file?.audio_url || null,
                    };
                })
            );
        }

        // Fetch Spotify Tracks
        const spotifyResults = await Spotify.search(term);

        // Combine both results
        setSearchResults([...quranResults, ...spotifyResults]);
    } catch (error) {
        console.error("Error fetching data:", error);
        setSearchResults([]);
    }
};


    const addToPlaylist = (track) => {
        if (!playlist.some((t) => t.id === track.id)) {
            const updatedPlaylist = [...playlist, track];
            setPlaylist(updatedPlaylist);
            localStorage.setItem("playlist", JSON.stringify(updatedPlaylist)); // Save immediately
        }
    };

    const removeFromPlaylist = (track) => {
        const updatedPlaylist = playlist.filter((t) => t.id !== track.id);
        setPlaylist(updatedPlaylist);
        localStorage.setItem("playlist", JSON.stringify(updatedPlaylist)); // Save immediately
    };

    return (
        <div className="App">
            <Header />
            <SearchBar onSearch={handleSearch} />
            <div className="main-content">
                <SearchResults tracks={searchResults} onAdd={addToPlaylist} />
                <Playlist
                    tracks={playlist}
                    onRemove={removeFromPlaylist}
                    playlistName={playlistName}
                    setPlaylist={setPlaylist}
                    setPlaylistName={setPlaylistName}
                />
            </div>
        </div>
    );
}

export default App;
