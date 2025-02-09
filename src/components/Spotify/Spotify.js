const clientId = "bb3d05e43bcc49f8987ee065146168dc";
const redirectUri = "http://localhost:3000/";
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check URL for access token
    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresMatch[1]);

      // Clear token after expiration
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    }

    // Redirect user to Spotify for authentication
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    window.location = authUrl;
  },

  async search(term) {
    const token = Spotify.getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return data.tracks.items.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;

    const token = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    let userId;

    // Get user ID
    const userResponse = await fetch("https://api.spotify.com/v1/me", { headers });
    const userData = await userResponse.json();
    userId = userData.id;

    // Create playlist
    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers,
      method: "POST",
      body: JSON.stringify({ name }),
    });
    const playlistData = await playlistResponse.json();
    const playlistId = playlistData.id;

    // Add tracks to playlist
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers,
      method: "POST",
      body: JSON.stringify({ uris: trackUris }),
    });
  },
};

export default Spotify;
