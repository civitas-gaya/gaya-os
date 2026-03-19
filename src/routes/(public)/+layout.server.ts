import { prisma } from '$lib/server/prisma'
import type { LayoutServerLoad } from './$types'

const FEATURED_LAW_SLUGS = ['councils', 'citizenship', 'territory']

export const load: LayoutServerLoad = async () => {
  const docs = await prisma.document.findMany({
    where: {
      slug: { in: FEATURED_LAW_SLUGS },
      type: 'POLICY',
      versions: { some: { status: 'ACTIVE' } }
    },
    select: { title: true, slug: true }
  })

  // Preserve the defined order
  const featuredLaws = FEATURED_LAW_SLUGS
    .map(slug => docs.find(d => d.slug === slug))
    .filter(Boolean) as { title: string; slug: string }[]

  return { featuredLaws }
}
