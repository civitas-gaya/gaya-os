import { error, fail } from '@sveltejs/kit'
import { getDocumentBySlug, listDocumentVersions, createDocumentVersion } from '$lib/server/services/documents'
import { isValidVersionLabel } from '$lib/domain/documents'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
  if (locals.user?.role !== 'ADMIN') error(403, 'Forbidden')

  const document = await getDocumentBySlug(params.slug)
  if (!document) error(404, 'Document not found')

  const versions = await listDocumentVersions(document.id)

  return {
    document,
    versions,
    breadcrumbs: [
      { label: 'Documents', href: '/documents' },
      { label: document.title, href: `/documents/${params.slug}` },
      { label: 'New Version' }
    ]
  }
}

export const actions: Actions = {
  createVersion: async ({ locals, params, request }) => {
    if (locals.user?.role !== 'ADMIN') error(403, 'Forbidden')

    const document = await getDocumentBySlug(params.slug)
    if (!document) error(404, 'Document not found')

    const form = await request.formData()
    const content = (form.get('content') as string)?.trim()
    const changelog = (form.get('changelog') as string)?.trim() || undefined
    const versionLabel = (form.get('versionLabel') as string)?.trim()

    if (!content) return fail(400, { error: 'Content is required.' })
    if (!versionLabel || !isValidVersionLabel(versionLabel)) {
      return fail(400, { error: 'Version must be in MAJOR.MINOR.PATCH format (e.g. 0.1.0).' })
    }

    try {
      await createDocumentVersion(document.id, { content, changelog, versionLabel }, locals.user!.id)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong.'
      return fail(400, { error: message })
    }

    return { success: `Version ${versionLabel} saved as draft.` }
  }
}
