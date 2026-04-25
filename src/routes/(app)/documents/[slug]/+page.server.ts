import { error, fail, redirect } from '@sveltejs/kit'
import {
  getDocumentBySlug,
  assignDocumentUnit,
  deleteDocument,
  listUnits
} from '$lib/server/services/documents'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
  const document = await getDocumentBySlug(params.slug)
  if (!document) error(404, 'Document not found')

  const isAdmin = locals.user?.role === 'ADMIN'

  if (!isAdmin && !document.activeContent) {
    error(404, 'No active version for this document')
  }

  const units = isAdmin ? await listUnits() : []

  return {
    document,
    isAdmin,
    units,
    breadcrumbs: [
      { label: 'Documents', href: '/documents' },
      { label: document.title }
    ]
  }
}

export const actions: Actions = {
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

    return { success: `"${document.title}" was deleted.` }
  },

  assignUnit: async ({ locals, params, request }) => {
    if (locals.user?.role !== 'ADMIN') error(403, 'Forbidden')

    const document = await getDocumentBySlug(params.slug)
    if (!document) error(404, 'Document not found')

    const form = await request.formData()
    const unitId = (form.get('unitId') as string)?.trim() || null

    try {
      await assignDocumentUnit(document.id, unitId)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong.'
      return fail(400, { error: message })
    }

    redirect(302, `/documents/${params.slug}`)
  }
}
