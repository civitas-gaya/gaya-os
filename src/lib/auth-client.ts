import { createAuthClient } from 'better-auth/svelte'
import { passkeyClient } from '@better-auth/passkey/client'
import { usernameClient } from 'better-auth/client/plugins'

// baseURL is omitted — better-auth uses the current origin automatically,
// which works correctly both locally and on Vercel.
export const authClient = createAuthClient({
  plugins: [passkeyClient(), usernameClient()]
})

export const { signIn, signUp, signOut, useSession } = authClient
