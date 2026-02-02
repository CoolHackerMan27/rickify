interface SpotifyEntry {
	ts: string;
	username: string;
	platform: string;
	ms_played: number;
	conn_country: string;
	ip_addr_decrypted: string;
	useyr_agent_decrypted: string;
	master_metadata_track_name: string | null;
	master_metadata_album_artist_name: string | null;
	master_metadata_album_album_name: string | null;
	spotify_track_uri: string | null;
	episode_name: string | null;
	episode_show_name: string | null;
	spotify_episode_uri: string | null;
	reason_start: string;
	reason_end: string;
	shuffle: boolean | null;
	skipped: boolean | null;
	offline: boolean | null;
	offline_timestamp: number | null;
	incognito_mode: boolean | null;
}
export async function parseSpotifyJSON(file: File) {
	//take in the parsed json
	const text = await file.text();
	const data: SpotifyEntry[] = JSON.parse(text);
	const listings = data.map((entry) => {
		return {
			timestamp: entry.ts,
			trackName: entry.master_metadata_track_name,
			artistName: entry.master_metadata_album_artist_name,
			albumName: entry.master_metadata_album_album_name,
			msPlayed: entry.ms_played
		};
	});
	return listings;
}
