<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
</script>

<div class="min-h-screen">
	<div class="mx-auto max-w-2xl px-6 py-16">
		<!-- Header -->
		<div class="mb-8">
			<Button variant="ghost" href="/">← Back Home</Button>
		</div>

		<!-- Title -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold tracking-tight">About Rickify</h1>
			<Badge variant="secondary">v1.0.0</Badge>
		</div>

		<!-- What is this -->
		<Card.Root class="mb-6">
			<Card.Header>
				<Card.Title>What is this?</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4 text-zinc-400">
				<p>
					Just a random project I made to analyze my Spotify listening data. I wanted to learn
					SvelteKit and thought this would be a fun way to do it. Will this get updated? Maybe,
					depends idk.
				</p>
			</Card.Content>
		</Card.Root>

		<!-- How to get your data -->
		<Card.Root class="mb-6">
			<Card.Header>
				<Card.Title>How to get your Spotify data</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-3 text-zinc-400">
				<ol class="list-inside list-decimal space-y-2">
					<li>
						Go to your <a
							href="https://www.spotify.com/account/privacy/"
							target="_blank"
							rel="noopener"
							class="text-green-400 underline hover:text-green-300">Spotify Privacy Settings</a
						>
					</li>
					<li>Scroll down and request your "Extended streaming history"</li>
					<li>Wait for Spotify to email you (can take up to 30 days)</li>
					<li>Download and unzip the files</li>
					<li>Drop the JSON files onto Rickify</li>
				</ol>
			</Card.Content>
		</Card.Root>

		<!-- Tech Stack -->
		<Card.Root class="mb-6">
			<Card.Header>
				<Card.Title>Built with</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-wrap gap-2">
					<Badge>SvelteKit</Badge>
					<Badge>TypeScript</Badge>
					<Badge>Tailwind CSS</Badge>
					<Badge>shadcn-svelte</Badge>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Links -->
		<div class="flex justify-center gap-4">
			<Button variant="outline" href="/license">License</Button>
		</div>
	</div>
</div>
