<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { enhance, applyAction } from '$app/forms'
  import { page } from '$app/state'
  import { toast } from 'svelte-sonner'
  import { marked } from 'marked'
  import * as Card from '$lib/components/ui/card'
  import * as Dialog from '$lib/components/ui/dialog'
  import * as Select from '$lib/components/ui/select'
  import * as Tooltip from '$lib/components/ui/tooltip'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Label } from '$lib/components/ui/label'
  import { Separator } from '$lib/components/ui/separator'
  import { FilePen, Trash2 } from '@lucide/svelte'
  import { buttonVariants } from '$lib/components/ui/button'
  import { DOCUMENT_TYPE_LABELS } from '$lib/domain/documents'
  import type { PageData, ActionData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()

  $effect(() => {
    if (!browser) return
    if (form?.error) toast.error(form.error)
  })

  function enhanceDelete() {
    return async ({ result }: { result: import('@sveltejs/kit').ActionResult }) => {
      if (result.type === 'success' && result.data?.success) {
        toast.success(result.data.success as string)
        await goto('/documents')
      } else {
        await applyAction(result)
      }
    }
  }

  const renderedHtml = $derived(
    data.document.activeContent ? (marked.parse(data.document.activeContent) as string) : ''
  )

  const base = $derived(`/documents/${data.document.slug}`)
  const isHistory = $derived(page.url.pathname.startsWith(`${base}/history`))
  const isDiff = $derived(page.url.pathname.startsWith(`${base}/diff`))
  const isCurrent = $derived(!isHistory && !isDiff)

  function formatDate(d: Date | string): string {
    return new Date(d).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  let deleteOpen = $state(false)

  // Unit assign form state — falls back to the national unit as default
  let selectedUnitId = $state('')
  $effect(() => {
    const nationalUnit = data.units.find((u) => u.isNational)
    selectedUnitId = data.document.unit?.id ?? nationalUnit?.id ?? ''
  })
</script>

<svelte:head>
  <title>{data.document.title} · Gaya OS</title>
</svelte:head>

<div class="mb-6">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <h1 class="text-3xl font-bold tracking-tight">{data.document.title}</h1>
    <div class="flex items-center gap-2">
      <Badge variant="secondary">{DOCUMENT_TYPE_LABELS[data.document.type]}</Badge>
      {#if data.document.unit}
        <Badge variant="outline">{data.document.unit.name}</Badge>
      {/if}
      {#if data.document.activeVersion}
        <Badge variant="outline" class="font-mono">v{data.document.activeVersion.versionLabel}</Badge>
      {/if}
    </div>
  </div>
</div>

<!-- Tabs + Admin action buttons on the same row -->
<div class="flex items-center justify-between gap-2 mb-6">
  <div class="flex gap-1">
    <Button variant={isCurrent ? 'default' : 'ghost'} size="sm" href={base}>Current</Button>
    <Button variant={isHistory ? 'default' : 'ghost'} size="sm" href="{base}/history">History</Button>
    <Button variant={isDiff ? 'default' : 'ghost'} size="sm" href="{base}/diff">Diff</Button>
  </div>

  {#if data.isAdmin}
    <div class="flex items-center gap-1">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <a href="{base}/new" class={buttonVariants({ variant: 'outline', size: 'icon' })} {...props}>
                <FilePen class="size-4" />
              </a>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content>New version</Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger
            class="{buttonVariants({ variant: 'outline', size: 'icon' })} text-destructive hover:text-destructive"
            onclick={() => { deleteOpen = true }}
          >
            <Trash2 class="size-4" />
          </Tooltip.Trigger>
          <Tooltip.Content>Delete document</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>

    <Dialog.Root bind:open={deleteOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete "{data.document.title}"?</Dialog.Title>
          <Dialog.Description>
            This will permanently delete the document and all its versions. This action cannot be undone.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button variant="outline" onclick={() => { deleteOpen = false }}>Cancel</Button>
          <form method="POST" action="?/deleteDocument" use:enhance={enhanceDelete}>
            <Button type="submit" variant="destructive">Delete permanently</Button>
          </form>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
</div>

{#if data.document.activeContent}
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
    <div class="prose max-w-none">
      {@html renderedHtml}
    </div>

    <aside class="flex flex-col gap-4">
      <Card.Root>
        <Card.Content class="pt-4 flex flex-col gap-3">
          <div>
            <p class="text-xs text-muted-foreground mb-1">Type</p>
            <Badge variant="secondary">{DOCUMENT_TYPE_LABELS[data.document.type]}</Badge>
          </div>
          <div>
            <p class="text-xs text-muted-foreground mb-1">Scope</p>
            {#if data.document.unit}
              <Badge variant="outline">{data.document.unit.name}</Badge>
            {:else}
              <p class="text-sm text-muted-foreground">National</p>
            {/if}
          </div>
          {#if data.document.activeVersion}
            <div>
              <p class="text-xs text-muted-foreground mb-1">Version</p>
              <Badge variant="outline" class="font-mono">v{data.document.activeVersion.versionLabel}</Badge>
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">Published</p>
              <p class="text-sm">{formatDate(data.document.activeVersion.createdAt)}</p>
            </div>
            {#if data.document.activeVersion.createdBy}
              <div>
                <p class="text-xs text-muted-foreground mb-1">Author</p>
                <p class="text-sm">
                  {data.document.activeVersion.createdBy.username
                    ? `@${data.document.activeVersion.createdBy.username}`
                    : data.document.activeVersion.createdBy.name}
                </p>
              </div>
            {/if}
            {#if data.document.activeVersion.changelog}
              <Separator />
              <div>
                <p class="text-xs text-muted-foreground mb-1">Changelog</p>
                <p class="text-sm">{data.document.activeVersion.changelog}</p>
              </div>
            {/if}
          {/if}
          <Separator />
          <a href="{base}/history" class="text-primary text-sm hover:underline underline-offset-4">
            View version history →
          </a>
        </Card.Content>
      </Card.Root>

      {#if data.isAdmin}
        <Card.Root>
          <Card.Header class="pb-2">
            <p class="text-xs font-medium">Assign Scope</p>
          </Card.Header>
          <Card.Content class="pt-0">
            <form method="POST" action="?/assignUnit" class="flex flex-col gap-2">
              <Label for="unitId" class="sr-only">Unit</Label>
              <Select.Root type="single" name="unitId" bind:value={selectedUnitId}>
                <Select.Trigger id="unitId" class="text-xs h-8">
                  {data.units.find((u) => u.id === selectedUnitId)?.name ?? 'Select scope...'}
                </Select.Trigger>
                <Select.Content>
                  {#each data.units as unit}
                    <Select.Item value={unit.id}>{unit.name}</Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
              <Button type="submit" size="sm" variant="outline" class="h-7 text-xs">Save</Button>
            </form>
          </Card.Content>
        </Card.Root>
      {/if}
    </aside>
  </div>
{:else}
  <p class="text-muted-foreground text-sm">
    No active version yet.
    {#if data.isAdmin}
      <a href="{base}/new" class="text-primary hover:underline underline-offset-4">Create the first version →</a>
    {/if}
  </p>
{/if}
