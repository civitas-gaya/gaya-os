<script lang="ts">
  import '../app.css'
  import favicon from '$lib/assets/favicon.svg'
  import type { LayoutData } from './$types'
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'

  injectSpeedInsights()

  let {
    data,
    children
  }: { data: LayoutData; children: import('svelte').Snippet } = $props()
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
