import { prisma } from '$lib/server/prisma'
import { getAllSettings } from '$lib/server/services/settings'
import { VERSION } from '$lib/version'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent()

  const [activeConstitution, citizenCount, visitorCount, settings] =
    await Promise.all([
      prisma.documentVersion.findFirst({
        where: { status: 'ACTIVE', document: { type: 'CONSTITUTION' } },
        select: { versionLabel: true }
      }),
      prisma.user.count({ where: { civicStatus: 'CITIZEN' } }),
      prisma.user.count({ where: { civicStatus: 'VISITOR' } }),
      getAllSettings()
    ])

  return {
    ...parentData,
    constitutionVersion: activeConstitution?.versionLabel ?? null,
    citizenCount,
    visitorCount,
    appVersion: VERSION,
    stage: settings.nation.stage,
    membershipOpen: settings.citizenship.open
  }
}
