<script lang="ts">
	//get data from sessionstore
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		parseSpotifyJSON,
		getFavArtist,
		getTotalMinutesPlayed,
		getUniqueTracksPlayed,
		getSongsByArtist,
		getMinArtistsPlayed,
		getAllArtists
	} from './parse';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	let parsedFiles: {
		timestamp: string;
		trackName: string | null;
		artistName: string | null;
		albumName: string | null;
		msPlayed: number;
	}[] = [];
	let favArtist: string | null = null;
	let minutesPlayed: number = 0;
	let songs: number = 0;
	let artists: number = 0;
	let detailed: { trackName: string; minutesPlayed: number }[] = [];
	let isLoading = true;
	let artistList: string[] | null = null;

	onMount(async () => {
		parsedFiles = await parseSpotifyJSON();
		favArtist = getFavArtist(parsedFiles);
		minutesPlayed = getTotalMinutesPlayed(parsedFiles);
		songs = getUniqueTracksPlayed(parsedFiles);
		artists = getMinArtistsPlayed(parsedFiles);
		detailed = getSongsByArtist(parsedFiles, favArtist ?? 'Unknown Artist').sort(
			(a, b) => b.minutesPlayed - a.minutesPlayed
		); // Sort by most played
		isLoading = false;
		artistList = getAllArtists(parsedFiles);
		console.log('detailed:', detailed);
	});
</script>

<div class="min-h-screen">
	<div class="mx-auto max-w-7xl px-6 py-8">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold tracking-tight">Your Listening Stats</h1>
				<p class="text-zinc-500">You have bad taste in music tbh</p>
			</div>
			<Button variant="outline" onclick={() => goto('/')}>← Back Home</Button>
		</div>

		{#if isLoading}
			<div class="flex items-center justify-center py-20">
				<p class="text-zinc-500">Loading your data...</p>
			</div>
		{:else}
			<!-- Stats Grid -->
			<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
				<Card.Root>
					<Card.Content class="p-6">
						<p class="text-sm font-medium text-zinc-500">Total Minutes</p>
						<p class="text-3xl font-bold">
							{minutesPlayed.toLocaleString()}
						</p>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Content class="p-6">
						<p class="text-sm font-medium text-zinc-500">Unique Songs</p>
						<p class="text-3xl font-bold">
							{songs.toLocaleString()}
						</p>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Content class="p-6">
						<p class="text-sm font-medium text-zinc-500">Artists</p>
						<p class="text-3xl font-bold">
							{artists.toLocaleString()}
						</p>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Content class="p-6">
						<p class="text-sm font-medium text-zinc-500">Hours Listened</p>
						<p class="text-3xl font-bold">
							{Math.round(minutesPlayed / 60).toLocaleString()}
						</p>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Content class="p-6">
						<p class="text-sm font-medium text-zinc-500">Favorite Artist</p>
						<p class="text-3xl font-bold">
							{getFavArtist(parsedFiles) ?? 'N/A'}
						</p>
					</Card.Content>
				</Card.Root>
			</div>

			<div>
				<!--DropDown to select artist -->
				<Card.Root class="mb-8">
					<Card.Header>
						<Card.Title>Select an Artist</Card.Title>
						<Card.Description>See your top songs by artist</Card.Description>
					</Card.Header>
					<Card.Content>
						<select
							bind:value={favArtist}
							onchange={() => {
								detailed = getSongsByArtist(parsedFiles, favArtist ?? 'Unknown Artist').sort(
									(a, b) => b.minutesPlayed - a.minutesPlayed
								);
							}}
							class="mt-4 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
						>
							{#if artistList}
								{#each artistList as artist}
									<option value={artist}>{artist}</option>
								{/each}
							{:else}
								<option disabled>No artists found</option>
							{/if}
						</select>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Favorite Artist Section -->
			<Card.Root class="mb-8">
				<Card.Header>
					<div class="flex items-center gap-3">
						<Card.Title class="text-xl">Selected Artist</Card.Title>

						{#if favArtist === getFavArtist(parsedFiles)}
							<Badge>Most Played</Badge>
						{/if}
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-4xl font-bold">
						{favArtist ?? 'N/A'}
					</p>
				</Card.Content>
			</Card.Root>

			<!-- Detailed Breakdown -->
			{#if favArtist && detailed.length > 0}
				<Card.Root>
					<Card.Header>
						<Card.Title>Top Songs by {favArtist}</Card.Title>
						<Card.Description>Sorted by listening time</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-3">
							{#each detailed.slice(0, 15) as song, index}
								<div class="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
									<div class="flex items-center gap-3">
										<span
											class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-sm font-medium"
										>
											{index + 1}
										</span>
										<span class="font-medium">
											{song.trackName}
										</span>
									</div>
									<Badge variant="secondary">{Math.round(song.minutesPlayed)} min</Badge>
								</div>
							{/each}
							{#if detailed.length > 15}
								<p class="pt-2 text-center text-sm text-zinc-500">
									...and {detailed.length - 15} more songs
								</p>
							{/if}
						</div>
					</Card.Content>
				</Card.Root>
			{:else}
				<Card.Root>
					<Card.Content class="py-12 text-center">
						<p class="text-zinc-500">No detailed data available.</p>
					</Card.Content>
				</Card.Root>
			{/if}
		{/if}
	</div>
</div>
