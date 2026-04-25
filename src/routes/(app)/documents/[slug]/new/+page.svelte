<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { enhance } from '$app/forms'
  import { toast } from 'svelte-sonner'
  import * as Card from '$lib/components/ui/card'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import { Separator } from '$lib/components/ui/separator'
  import {
    DOCUMENT_TYPE_LABELS,
    nextVersionLabel,
    type VersionBump
  } from '$lib/domain/documents'
  import type { PageData, ActionData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()

  const hasVersions = $derived(data.versions.length > 0)
  const latestVersion = $derived(data.versions[0] ?? null)

  let initialVersionLabel = $state('0.1.0')
  let bump = $state<VersionBump>('minor')

  const computedVersionLabel = $derived(
    hasVersions && latestVersion
      ? nextVersionLabel(latestVersion.versionLabel, bump)
      : initialVersionLabel
  )

  let content = $state('')

  $effect(() => {
    content = data.document.activeContent ?? ''
  })

  $effect(() => {
    if (!browser) return
    if (form?.error) toast.error(form.error)
    if (form?.success) {
      toast.success(form.success)
      goto(`/documents/${data.document.slug}/history`)
    }
  })

  const editorModules = browser
    ? Promise.all([
        import('svelte-codemirror-editor'),
        import('@codemirror/lang-markdown'),
        import('@uiw/codemirror-theme-tokyo-night'),
        import('@codemirror/view')
      ])
    : null
</script>

<svelte:head>
  <title>{data.document.title} · New Version · Gaya OS</title>
</svelte:head>

<div class="mb-6">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <h1 class="text-3xl font-bold tracking-tight">{data.document.title}</h1>
    <div class="flex items-center gap-2">
      <Badge variant="secondary">{DOCUMENT_TYPE_LABELS[data.document.type]}</Badge>
      {#if data.document.activeVersion}
        <Badge variant="outline" class="font-mono">v{data.document.activeVersion.versionLabel} active</Badge>
      {/if}
    </div>
  </div>
</div>

<Card.Root>
  <Card.Header class="pb-3">
    <Card.Title class="text-base">New Version</Card.Title>
    <p class="text-muted-foreground text-sm">Write the document content in Markdown.</p>
  </Card.Header>
  <Separator />
  <Card.Content class="pt-4">
    <form method="POST" action="?/createVersion" use:enhance class="flex flex-col gap-4">
      <!-- Version label -->
      <div class="flex flex-col gap-1.5">
        <Label>Version</Label>
        {#if hasVersions}
          <div class="flex flex-wrap gap-2">
            {#each (['patch', 'minor', 'major'] as VersionBump[]) as b}
              <button
                type="button"
                onclick={() => { bump = b }}
                class="flex-1 rounded-md border px-3 py-2 text-sm transition-colors {bump === b
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background hover:bg-accent'}"
              >
                <div class="font-medium capitalize">{b}</div>
                <div class="text-xs opacity-70 mt-0.5">
                  {nextVersionLabel(latestVersion!.versionLabel, b)}
                </div>
              </button>
            {/each}
          </div>
          <p class="text-muted-foreground text-xs">
            New version: <span class="font-mono font-medium">v{computedVersionLabel}</span>
            (previous: v{latestVersion!.versionLabel})
          </p>
        {:else}
          <Input
            name="initialVersion"
            bind:value={initialVersionLabel}
            placeholder="0.1.0"
            pattern="\d+\.\d+\.\d+"
            class="font-mono"
          />
          <p class="text-muted-foreground text-xs">Initial version in MAJOR.MINOR.PATCH format</p>
        {/if}
        <input type="hidden" name="versionLabel" value={computedVersionLabel} />
      </div>

      <!-- CodeMirror editor -->
      <div class="flex flex-col gap-1.5">
        <Label for="content-fallback">Content (Markdown)</Label>
        {#if editorModules}
          {#await editorModules then [{ default: CodeMirror }, { markdown }, { tokyoNight }, { EditorView }]}
            <div class="rounded-md border border-input overflow-hidden codemirror-wrapper">
              <CodeMirror
                bind:value={content}
                lang={markdown()}
                theme={tokyoNight}
                extensions={[EditorView.lineWrapping]}
                styles={{ '&': { height: '520px', fontSize: '13px' } }}
              />
            </div>
          {:catch}
            <textarea
              id="content-fallback"
              bind:value={content}
              class="border-input bg-background flex min-h-112.5 w-full rounded-md border px-3 py-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-2"
              placeholder="# Document title&#10;&#10;Write your content in Markdown..."
            ></textarea>
          {/await}
        {:else}
          <textarea
            id="content-fallback"
            bind:value={content}
            class="border-input bg-background flex min-h-112.5 w-full rounded-md border px-3 py-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-2"
            placeholder="# Document title&#10;&#10;Write your content in Markdown..."
          ></textarea>
        {/if}
        <input type="hidden" name="content" value={content} />
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="changelog">Changelog <span class="text-muted-foreground font-normal">(optional)</span></Label>
        <Input
          id="changelog"
          name="changelog"
          placeholder="Brief description of changes..."
        />
      </div>

      <Button type="submit" size="sm" class="self-start">Save as draft</Button>
    </form>
  </Card.Content>
</Card.Root>

<style>
  :global(.codemirror-wrapper .cm-editor) {
    border-radius: 0;
  }
  :global(.codemirror-wrapper .cm-scroller) {
    scrollbar-width: thin;
    scrollbar-color: #525252 transparent;
    overflow-y: auto;
  }
  :global(.codemirror-wrapper .cm-scroller::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
  }
  :global(.codemirror-wrapper .cm-scroller::-webkit-scrollbar-thumb) {
    background: #525252;
    border-radius: 3px;
  }
  :global(.codemirror-wrapper .cm-scroller::-webkit-scrollbar-track) {
    background: transparent;
  }
</style>
