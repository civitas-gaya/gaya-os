import { prisma } from '$lib/server/prisma'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const doc = await prisma.document.findFirst({
    where: { slug: params.slug, type: 'POLICY' },
    include: {
      versions: {
        where: { status: 'ACTIVE' },
        take: 1,
        select: {
          versionLabel: true,
          content: true,
          changelog: true,
          createdAt: true,
          createdBy: { select: { id: true, name: true, username: true } }
        }
      }
    }
  })

  if (!doc) {
    error(404, 'Law not found')
  }

  if (!doc.versions[0]) {
    return { document: null, title: doc.title }
  }

  const v = doc.versions[0]
  return {
    document: {
      title: doc.title,
      slug: doc.slug,
      versionLabel: v.versionLabel,
      content: v.content,
      changelog: v.changelog,
      createdAt: v.createdAt,
      createdBy: v.createdBy
    },
    title: doc.title
  }
}
