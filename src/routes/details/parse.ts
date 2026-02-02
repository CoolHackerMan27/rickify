// Parses spotify jsons to get listing data
//Here is one entry from the json file for reference:
// {
// "ts": "YYY-MM-DD 13:30:30",
// "username": "_________",
// "platform": "_________",
// "ms_played": _________,
// "conn_country": "_________",
// "ip_addr_decrypted": "___.___.___.___",
// "user_agent_decrypted": "_________",
// "master_metadata_track_name": "_________",
// "master_metadata_album_artist_name:_________",
// "master_metadata_album_album_name:_________",
// "spotify_track_uri:_________",
// "episode_name": _________,
// "episode_show_name": _________,
// "spotify_episode_uri:_________",
// "reason_start": "_________",
// "reason_end": "_________",
// "shuffle": null/true/false,
// "skipped": null/true/false,
// "offline": null/true/false,
// "offline_timestamp": _________,
// "incognito_mode": null/true/false,
// }

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

export async function parseSpotifyJSON() {
	const storedFiles = sessionStorage.getItem('droppedFiles');
	if (!storedFiles) {
		return [];
	}
	// Data is now pre-processed in +page.svelte, just parse and return
	const data: {
		ts: string;
		trackName: string | null;
		artistName: string | null;
		albumName: string | null;
		msPlayed: number;
	}[] = JSON.parse(storedFiles);

	// Map to expected format (ts -> timestamp for consistency)
	return data.map((entry) => ({
		timestamp: entry.ts,
		trackName: entry.trackName,
		artistName: entry.artistName,
		albumName: entry.albumName,
		msPlayed: entry.msPlayed
	}));
}

export function getMinutesPlayed(msPlayed: number): number {
	return Math.floor(msPlayed / 60000);
}

export function getAllArtists(
	listings: {
		timestamp: string;
		trackName: string | null;
		artistName: string | null;
		albumName: string | null;
		msPlayed: number;
	}[]
): string[] | null {
	{
		const artistsSet = new Set<string>();
		listings.forEach((entry) => {
			if (entry.artistName) {
				artistsSet.add(entry.artistName);
			}
		});
		return Array.from(artistsSet);
	}
}

export function getFavArtist(
	listings: {
		timestamp: string;
		trackName: string | null;
		artistName: string | null;
		albumName: string | null;
		msPlayed: number;
	}[]
): string | null {
	const artistPlaytime: { [artist: string]: number } = {};
	listings.forEach((entry) => {
		if (entry.artistName) {
			if (!artistPlaytime[entry.artistName]) {
				artistPlaytime[entry.artistName] = 0;
			}
			artistPlaytime[entry.artistName] += entry.msPlayed;
		}
	});
	let favArtist: string | null = null;
	let maxPlaytime = 0;
	for (const artist in artistPlaytime) {
		if (artistPlaytime[artist] > maxPlaytime) {
			maxPlaytime = artistPlaytime[artist];
			favArtist = artist;
		}
	}
	return favArtist;
}
export function getTotalMinutesPlayed(
	listings: {
		timestamp: string;
		trackName: string | null;
		artistName: string | null;
		albumName: string | null;
		msPlayed: number;
	}[]
): number {
	const totalMsPlayed = listings.reduce((total, entry) => total + entry.msPlayed, 0);
	return getMinutesPlayed(totalMsPlayed);
}
export function getTotalTracksPlayed(
	listings: {
		timestamp: string;
		trackName: string | null;
		artistName: string | null;
		albumName: string | null;
		msPlayed: number;
	}[]
): number {
	return listings.filter((entry) => entry.trackName !== null).length;
}

export function getUniqueTracksPlayed(
	listings: {
		timestamp: string;
		trackName: string | null;
		artistName: string | null;
		albumName: string | null;
		msPlayed: number;
	}[]
): number {
	const uniqueTracks = new Set<string>();
	listings.forEach((entry) => {
		if (entry.trackName) {
			uniqueTracks.add(entry.trackName);
		}
	});
	return uniqueTracks.size;
}
export function getMinArtistsPlayed(
	listings: {
		timestamp: string;
		trackName: string | null;
		artistName: string | null;
		albumName: string | null;
		msPlayed: number;
	}[]
): number {
	const uniqueArtists = new Set<string>();
	listings.forEach((entry) => {
		if (entry.artistName) {
			uniqueArtists.add(entry.artistName);
		}
	});
	return uniqueArtists.size;
}

export function getSongsByArtist(
	listings: {
		timestamp: string;
		trackName: string | null;
		artistName: string | null;
		albumName: string | null;
		msPlayed: number;
	}[],
	artist: string
): { trackName: string; minutesPlayed: number }[] {
	const songPlaytime: { [track: string]: number } = {};
	listings.forEach((entry) => {
		if (entry.artistName === artist && entry.trackName) {
			if (!songPlaytime[entry.trackName]) {
				songPlaytime[entry.trackName] = 0;
			}
			songPlaytime[entry.trackName] += entry.msPlayed;
		}
	});
	return Object.entries(songPlaytime).map(([trackName, msPlayed]) => ({
		trackName,
		minutesPlayed: getMinutesPlayed(msPlayed)
	}));
}
