<script lang="ts">
  import { Separator } from '$lib/components/ui/separator'
</script>

<footer
  class="border-t border-border/40 bg-background/95 backdrop-blur"
  style="margin-left: calc(50% - 50vw); width: 100vw;"
>
  <div class="mx-auto max-w-7xl px-8 lg:px-16 py-12">
    <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

      <!-- Brand -->
      <div class="lg:col-span-1">
        <a href="/" class="font-semibold tracking-tight">Civitas Gaya</a>
        <p class="mt-3 text-sm text-muted-foreground leading-relaxed">
          A council-democratic micronation in exile, built on transparency,
          participation and the free flow of power.
        </p>
      </div>

      <!-- Legal Documents -->
      <div>
        <div class="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Legal Documents
        </div>
        <ul class="space-y-2">
          <li><a href="/constitution" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Constitution</a></li>
          <li><a href="/laws/councils" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Law on Councils</a></li>
          <li><a href="/laws/citizenship" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Citizenship & Naturalisation Law</a></li>
          <li><a href="/laws/territory" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Territorial Law in Exile</a></li>
          <li><a href="/laws" class="text-sm text-muted-foreground hover:text-foreground transition-colors">All Laws & Regulations</a></li>
        </ul>
      </div>

      <!-- Navigation -->
      <div>
        <div class="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Navigation
        </div>
        <ul class="space-y-2">
          <li><a href="/government" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Government</a></li>
          <li><a href="/history" class="text-sm text-muted-foreground hover:text-foreground transition-colors">History</a></li>
          <li><a href="/faq" class="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
          <li><a href="/contact" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
        </ul>
      </div>

      <!-- Open Source -->
      <div>
        <div class="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Open Source
        </div>
        <p class="text-sm text-muted-foreground leading-relaxed mb-3">
          Gaya OS is released under the
          <a
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            rel="noopener noreferrer"
            class="text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground transition-colors"
          >MIT License</a>.
          Anyone can read, audit and contribute to the code.
        </p>
        <a
          href="https://github.com/civitas-gaya/gaya-os"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View source on GitHub →
        </a>
      </div>

    </div>

    <Separator class="my-8" />

    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
      <span>© {new Date().getFullYear()} Civitas Gaya. All governance documents are public record.</span>
      <span>Built with transparency. Governed by citizens.</span>
    </div>
  </div>
</footer>
