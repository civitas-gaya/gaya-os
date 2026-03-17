import { error } from '@sveltejs/kit'
import { getCitizenByUsername } from '$lib/server/services/citizens'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const citizen = await getCitizenByUsername(params.username)
  if (!citizen) error(404, 'Citizen not found')

  return {
    citizen,
    breadcrumbs: [
      { label: 'Citizens', href: '/citizens' },
      { label: `@${citizen.username}` }
    ]
  }
}
