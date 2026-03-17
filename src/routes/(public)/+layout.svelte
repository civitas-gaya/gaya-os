<script lang="ts">
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'

  import { dev } from '$app/environment';
  import { injectAnalytics } from '@vercel/analytics/sveltekit';

  injectAnalytics({ mode: dev ? 'development' : 'production' });

  let { children } = $props()
</script>

<Header />
<main class="mx-auto min-h-[calc(100vh-3.5rem)] max-w-7xl px-4">
  {@render children()}
</main>
<Footer />
