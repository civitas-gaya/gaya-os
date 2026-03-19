import { prisma } from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const docs = await prisma.document.findMany({
    where: {
      type: 'POLICY',
      versions: { some: { status: 'ACTIVE' } }
    },
    include: {
      versions: {
        where: { status: 'ACTIVE' },
        take: 1,
        select: {
          versionLabel: true,
          createdAt: true
        }
      }
    },
    orderBy: { title: 'asc' }
  })

  return {
    laws: docs.map(doc => ({
      title: doc.title,
      slug: doc.slug,
      versionLabel: doc.versions[0]?.versionLabel ?? null,
      publishedAt: doc.versions[0]?.createdAt ?? null
    }))
  }
}
