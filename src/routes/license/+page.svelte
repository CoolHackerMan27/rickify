<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { base } from '$app/paths';
</script>

<div class="min-h-screen">
	<div class="mx-auto max-w-2xl px-6 py-16">
		<div class="mb-8">
			<Button variant="ghost" href="{base}/">← Back Home</Button>
		</div>

		<Card.Root>
			<Card.Header>
				<h1 class="text-2xl font-bold">License</h1>
			</Card.Header>
			<Card.Content class="space-y-4 text-zinc-400">
				<p>This repo and all its content is licensed under the MIT License.</p>
				<p>
					See the <a
						href="https://opensource.org/licenses/MIT"
						target="_blank"
						rel="noopener noreferrer"
						class="text-green-400 underline hover:text-green-300">MIT License</a
					> for more details.
				</p>
			</Card.Content>
		</Card.Root>
	</div>
</div>
