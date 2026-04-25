import { error, fail, redirect } from '@sveltejs/kit'
import {
  getDocumentBySlug,
  listDocumentVersions,
  publishDocumentVersion,
  deleteDocument
} from '$lib/server/services/documents'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
  const document = await getDocumentBySlug(params.slug)
  if (!document) error(404, 'Document not found')

  const versions = await listDocumentVersions(document.id)

  return {
    document,
    versions,
    isAdmin: locals.user?.role === 'ADMIN',
    breadcrumbs: [
      { label: 'Documents', href: '/documents' },
      { label: document.title, href: `/documents/${params.slug}` },
      { label: 'History' }
    ]
  }
}

export const actions: Actions = {
  publishVersion: async ({ locals, params, request }) => {
    if (locals.user?.role !== 'ADMIN') error(403, 'Forbidden')

    const document = await getDocumentBySlug(params.slug)
    if (!document) error(404, 'Document not found')

    const form = await request.formData()
    const versionId = form.get('versionId') as string
    if (!versionId) return fail(400, { error: 'Version ID is required.' })

    try {
      await publishDocumentVersion(document.id, versionId, locals.user!.id)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong.'
      return fail(400, { error: message })
    }

    return { success: 'Version published successfully.' }
  },

  deleteDocument: async ({ locals, params }) => {
    if (locals.user?.role !== 'ADMIN') error(403, 'Forbidden')

    const document = await getDocumentBySlug(params.slug)
    if (!document) error(404, 'Document not found')

    try {
      await deleteDocument(document.id, locals.user!.id)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong.'
      return fail(400, { error: message })
    }

    redirect(302, '/documents')
  }
}
