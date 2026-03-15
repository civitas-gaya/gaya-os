<script lang="ts">
  import { signOut, useSession } from '$lib/auth-client'
  import { goto, invalidateAll } from '$app/navigation'
  import { Button } from '$lib/components/ui/button'
  import * as Tooltip from '$lib/components/ui/tooltip'
  import { LogIn, UserPlus, LayoutDashboard, LogOut } from '@lucide/svelte'

  const session = useSession()

  async function handleSignOut() {
    await signOut()
    await invalidateAll()
    await goto('/')
  }
</script>

<Tooltip.Provider delayDuration={300}>
  <header
    class="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
  >
    <div class="mx-auto grid h-14 max-w-7xl grid-cols-3 items-center px-4">
      <a href="/" class="flex items-center gap-2">
        <span class="font-semibold tracking-tight">Civitas Gaya</span>
      </a>

      <nav class="flex items-center justify-center gap-1">
        <Button variant="ghost" size="sm" href="/government">Government</Button>
        <Button variant="ghost" size="sm" href="/history">History</Button>
        <Button variant="ghost" size="sm" href="/faq">FAQ</Button>
        <Button variant="ghost" size="sm" href="/contact">Contact</Button>
      </nav>

      <div class="flex items-center justify-end gap-1">
        {#if $session.data?.user}
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="ghost" size="icon-sm" href="/dashboard">
                  <LayoutDashboard class="size-4" />
                </Button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>Dashboard</Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="ghost" size="icon-sm" onclick={handleSignOut}>
                  <LogOut class="size-4" />
                </Button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>Sign out</Tooltip.Content>
          </Tooltip.Root>
        {:else if !$session.isPending}
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="ghost" size="icon-sm" href="/auth/login">
                  <LogIn class="size-4" />
                </Button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>Sign in</Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <Button {...props} size="icon-sm" href="/auth/register">
                  <UserPlus class="size-4" />
                </Button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>Register</Tooltip.Content>
          </Tooltip.Root>
        {/if}
      </div>
    </div>
  </header>
</Tooltip.Provider>
