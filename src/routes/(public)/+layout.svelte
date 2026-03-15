<script lang="ts">
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'

  let { children } = $props()
</script>

<Header />
<main class="mx-auto min-h-[calc(100vh-3.5rem)] max-w-7xl px-4">
  {@render children()}
</main>
<Footer />
