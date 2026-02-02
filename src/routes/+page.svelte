<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import logo from '$lib/assets/image.jpg';

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'copy';
		}
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragging = false;
	}

	async function processFiles(fileList: FileList | null) {
		if (!fileList || fileList.length === 0) {
			console.log('No files to process');
			return;
		}

		const allData: {
			ts: string;
			trackName: string | null;
			artistName: string | null;
			albumName: string | null;
			msPlayed: number;
		}[] = [];

		for (let i = 0; i < fileList.length; i++) {
			const file = fileList[i];
			console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
			try {
				const text = await file.text();
				const json = JSON.parse(text);
				const entries = Array.isArray(json) ? json : [json];

				// Only keep the fields we need to reduce storage size
				for (const entry of entries) {
					allData.push({
						ts: entry.ts,
						trackName: entry.master_metadata_track_name ?? null,
						artistName: entry.master_metadata_album_artist_name ?? null,
						albumName: entry.master_metadata_album_album_name ?? null,
						msPlayed: entry.ms_played ?? 0
					});
				}
			} catch (err) {
				console.error('Error reading file:', file.name, err);
			}
		}
		console.log('Processed entries:', allData.length);

		try {
			sessionStorage.setItem('droppedFiles', JSON.stringify(allData));
			goto(`${base}/details`, {});
		} catch (err) {
			console.error('Storage error:', err);
			alert('Data is too large to store. Try uploading fewer files.');
		}
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragging = false;
		await processFiles(e.dataTransfer?.files ?? null);
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		processFiles(input.files);
	}
</script>

<div class="min-h-screen">
	<div class="mx-auto max-w-2xl px-6 py-16">
		<!-- Hero Section -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-5xl font-bold tracking-tight">Welcome to Rickify</h1>
			<p class="text-lg text-zinc-400">
				It's a random spotify data analysis thing. Made for fun and to learn SvelteKit.
			</p>
		</div>

		<!-- Logo Card -->
		<Card.Root class="mb-8">
			<Card.Content class="flex justify-center p-8">
				<img src={logo} alt="Rickify Logo" width="200" class="rounded-lg shadow-md" />
			</Card.Content>
		</Card.Root>

		<!-- Navigation -->
		<div class="flex justify-center">
			<Button variant="outline" href="{base}/about">About my site</Button>
		</div>

		<!-- Drop  -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="mt-8 rounded-lg border-2 border-dashed p-12 transition-colors {isDragging
				? 'border-green-500 bg-green-950'
				: 'border-zinc-700'}"
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
		>
			<div class="pointer-events-none flex flex-col items-center justify-center text-center">
				<p class="mb-2 text-lg font-medium text-zinc-300">
					{isDragging ? 'Drop your file here!' : 'Drag and drop files here'}
				</p>
				<p class="text-sm text-zinc-500">Supports json files</p>
				<p class="mt-4 text-sm text-zinc-500">or</p>
			</div>
			<div class="mt-4 flex justify-center">
				<input
					bind:this={fileInput}
					type="file"
					accept=".json"
					multiple
					class="hidden"
					onchange={handleFileSelect}
				/>
				<Button onclick={() => fileInput.click()}>Select Files</Button>
			</div>
			<div class="mt-6 text-center text-sm text-zinc-500">
				Your data is processed locally and never uploaded anywhere.
			</div>
		</div>
	</div>
</div>
