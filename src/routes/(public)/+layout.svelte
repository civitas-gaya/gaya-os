<script lang="ts">
  import PublicHeader from '$lib/components/public/PublicHeader.svelte'
  import PublicFooter from '$lib/components/public/PublicFooter.svelte'
  import type { LayoutData } from './$types'

  import { dev } from '$app/environment';
  import { injectAnalytics } from '@vercel/analytics/sveltekit';

  injectAnalytics({ mode: dev ? 'development' : 'production' });

  let { children, data }: { children: import('svelte').Snippet, data: LayoutData } = $props()
</script>

<PublicHeader />
<main class="mx-auto min-h-[calc(100vh-3.5rem)] max-w-7xl px-4">
  {@render children()}
</main>
<PublicFooter featuredLaws={data.featuredLaws} />
