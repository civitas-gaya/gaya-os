<script lang="ts">
  import { signOut, useSession } from '$lib/auth-client'
  import { goto, invalidateAll } from '$app/navigation'
  import { Button } from '$lib/components/ui/button'
  import * as Tooltip from '$lib/components/ui/tooltip'
  import * as Sheet from '$lib/components/ui/sheet'
  import { LogIn, UserPlus, LayoutDashboard, LogOut, Menu } from '@lucide/svelte'

  const session = useSession()

  const navLinks = [
    { href: '/government', label: 'Government' },
    { href: '/history', label: 'History' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' }
  ]

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
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
      <!-- Brand -->
      <a href="/" class="flex items-center gap-2">
        <span class="font-semibold tracking-tight">Civitas Gaya</span>
      </a>

      <!-- Desktop Nav (centered absolutely so brand + actions stay at edges) -->
      <nav class="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
        {#each navLinks as link}
          <Button variant="ghost" size="sm" href={link.href}>{link.label}</Button>
        {/each}
      </nav>

      <!-- Right side: Auth buttons (always visible) + Hamburger (mobile only) -->
      <div class="flex items-center gap-1">
        <!-- Auth buttons (icon-only, always in header) -->
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

        <!-- Hamburger (mobile only) -->
        <div class="md:hidden">
          <Sheet.Root>
            <Sheet.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="ghost" size="icon-sm" aria-label="Open menu">
                  <Menu class="size-4" />
                </Button>
              {/snippet}
            </Sheet.Trigger>
            <Sheet.Content side="right" class="w-72">
              <Sheet.Header>
                <Sheet.Title>
                  <a href="/" class="font-semibold tracking-tight">Civitas Gaya</a>
                </Sheet.Title>
              </Sheet.Header>

              <nav class="mt-6 flex flex-col gap-1 px-2">
                {#each navLinks as link}
                  <Button variant="ghost" class="justify-start" href={link.href}>
                    {link.label}
                  </Button>
                {/each}
              </nav>
            </Sheet.Content>
          </Sheet.Root>
        </div>
      </div>
    </div>
  </header>
</Tooltip.Provider>
