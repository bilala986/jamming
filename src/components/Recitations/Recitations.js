import React, { useState, useEffect } from "react";

function Recitation({ searchTerm }) {
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        if (!searchTerm) return; //Don't fetch if there is no search term
        
        fetch("https://api.quran.com/api/v4/chapters")
            .then((response) => response.json())
            .then((data) => setChapters(data.data || [])) 
            .catch((error) => console.log("Error fetching data: ", error));
    }, []);

    return (
        <div>
            <h2>Search Results for: {searchTerm}</h2>
            <ul>
                {chapters.length > 0 ? (
                    chapters.map((chapter) => (
                        <li key={chapter.id}>
                            {chapter.name} ({chapter.english_name})
                        </li>
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </ul>
        </div>
    );
}

export default Recitation;
