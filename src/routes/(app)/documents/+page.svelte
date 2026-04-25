<script lang="ts">
  import { toast } from 'svelte-sonner'
  import * as Card from '$lib/components/ui/card'
  import * as Dialog from '$lib/components/ui/dialog'
  import * as Select from '$lib/components/ui/select'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import { DOCUMENT_TYPE_LABELS } from '$lib/domain/documents'
  import type { PageData, ActionData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let newDocOpen = $state(false)
  let title = $state('')
  let type = $state('')
  let slug = $state('')
  let unitId = $state('')
  $effect(() => {
    unitId = data.units.find((u) => u.isNational)?.id ?? ''
  })
  let slugTouched = $state(false)

  $effect(() => {
    if (title && !slugTouched) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
  })

  $effect(() => {
    if (form?.error) toast.error(form.error)
  })

  function formatDate(d: Date | string): string {
    return new Date(d).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const availableTypes = $derived(
    Object.entries(DOCUMENT_TYPE_LABELS).filter(
      ([value]) => value !== 'CONSTITUTION' || !data.hasConstitution
    )
  )
</script>

<svelte:head>
  <title>Documents · Gaya OS</title>
</svelte:head>

<div class="mb-8 flex flex-wrap items-start justify-between gap-3">
  <div>
    <h1 class="text-3xl font-bold tracking-tight">Documents</h1>
    <p class="text-muted-foreground mt-1 text-sm">
      The founding documents of the micronation - constitution, policies, and procedures.
    </p>
  </div>
  {#if data.isAdmin}
    <Dialog.Root bind:open={newDocOpen}>
      <Dialog.Trigger>
        {#snippet child({ props })}
          <Button size="sm" {...props}>New Document</Button>
        {/snippet}
      </Dialog.Trigger>
      <Dialog.Content class="sm:max-w-md">
        <Dialog.Header>
          <Dialog.Title>New Document</Dialog.Title>
          <Dialog.Description>
            Create a new governance document. You can add content after creation.
          </Dialog.Description>
        </Dialog.Header>
        <form method="POST" action="?/createDocument" class="flex flex-col gap-4 mt-2">
          <div class="flex flex-col gap-1.5">
            <Label for="title">Title</Label>
            <Input
              id="title"
              name="title"
              bind:value={title}
              placeholder="e.g. Constitution"
              required
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="type">Type</Label>
            <Select.Root type="single" name="type" bind:value={type} required>
              <Select.Trigger id="type">
                {type ? DOCUMENT_TYPE_LABELS[type as keyof typeof DOCUMENT_TYPE_LABELS] : 'Select type...'}
              </Select.Trigger>
              <Select.Content>
                {#each availableTypes as [value, label]}
                  <Select.Item {value}>{label}</Select.Item>
                {/each}
                {#if data.hasConstitution}
                  <Select.Item value="CONSTITUTION" disabled>
                    Constitution (already exists)
                  </Select.Item>
                {/if}
              </Select.Content>
            </Select.Root>
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              bind:value={slug}
              oninput={() => { slugTouched = true }}
              placeholder="e.g. constitution"
              pattern="[a-z0-9-]+"
              required
            />
            <p class="text-muted-foreground text-xs">URL: /documents/{slug || '...'}</p>
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="unitId">Scope (Unit)</Label>
            <Select.Root type="single" name="unitId" bind:value={unitId}>
              <Select.Trigger id="unitId">
                {data.units.find((u) => u.id === unitId)?.name ?? 'Select scope...'}
              </Select.Trigger>
              <Select.Content>
                {#each data.units as unit}
                  <Select.Item value={unit.id}>{unit.name}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <Dialog.Footer class="mt-2">
            <Button variant="outline" type="button" onclick={() => { newDocOpen = false }}>
              Cancel
            </Button>
            <Button type="submit">Create document</Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
</div>

{#if data.documents.length === 0}
  <p class="text-muted-foreground text-sm">No documents published yet.</p>
{:else}
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each data.documents as doc}
      <a href="/documents/{doc.slug}" class="group block">
        <Card.Root class="h-full overflow-hidden transition-shadow group-hover:shadow-md pt-0">
          <div class="h-2 w-full {doc.type === 'CONSTITUTION'
            ? 'bg-linear-to-r from-amber-500/60 to-amber-300/30'
            : doc.type === 'POLICY'
            ? 'bg-linear-to-r from-primary/60 to-primary/20'
            : 'bg-linear-to-r from-muted-foreground/40 to-muted/20'}">
          </div>
          <Card.Content class="pt-4 pb-4">
            <p class="font-semibold leading-snug group-hover:text-primary transition-colors">
              {doc.title}
            </p>
            <div class="mt-1 text-xs text-muted-foreground">
              {#if doc.activeVersion}
                v{doc.activeVersion.versionLabel} · {formatDate(doc.activeVersion.createdAt)}
              {:else}
                <span class="italic">No active version</span>
              {/if}
            </div>
            <div class="flex flex-wrap items-center gap-1.5 mt-5">
              <Badge variant="secondary" class="text-xs">{DOCUMENT_TYPE_LABELS[doc.type]}</Badge>
              {#if doc.unit}
                <Badge variant="outline" class="text-xs">{doc.unit.name}</Badge>
              {/if}
            </div>
          </Card.Content>
        </Card.Root>
      </a>
    {/each}
  </div>
{/if}
