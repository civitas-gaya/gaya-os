import { fail } from '@sveltejs/kit'
import { Resend } from 'resend'
import { RESEND_API_KEY, RESEND_FROM_EMAIL } from '$env/static/private'
import type { Actions } from './$types'

const resend = new Resend(RESEND_API_KEY)
const fromEmail = RESEND_FROM_EMAIL || 'Civitas Gaya <onboarding@resend.dev>'

const TOPIC_ADDRESSES: Record<string, string> = {
  government: 'govern@civitasgaya.org',
  legal: 'legal@civitasgaya.org',
  immigration: 'immigration@civitasgaya.org',
  press: 'press@civitasgaya.org',
  development: 'dev@civitasgaya.org',
  other: 'govern@civitasgaya.org',
}

const TOPIC_LABELS: Record<string, string> = {
  government: 'Government & General Inquiries',
  legal: 'Legal & Constitutional Matters',
  immigration: 'Immigration & Citizenship',
  press: 'Press & Media',
  development: 'Development & Technical',
  other: 'Other',
}

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData()
    const topic = data.get('topic')?.toString().trim()
    const email = data.get('email')?.toString().trim()
    const message = data.get('message')?.toString().trim()
    const consent = data.get('consent')

    if (!topic || !TOPIC_ADDRESSES[topic]) {
      return fail(400, { error: 'Please select a topic.', topic, email, message })
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(400, { error: 'Please provide a valid email address.', topic, email, message })
    }
    if (!message || message.length < 10) {
      return fail(400, { error: 'Please describe your request (at least 10 characters).', topic, email, message })
    }
    if (!consent) {
      return fail(400, { error: 'Please confirm your consent to be contacted.', topic, email, message })
    }

    const to = TOPIC_ADDRESSES[topic]
    const topicLabel = TOPIC_LABELS[topic]

    try {
      await resend.emails.send({
        from: fromEmail,
        to,
        replyTo: email,
        subject: `[Contact] ${topicLabel} — from ${email}`,
        html: `
          <p><strong>Topic:</strong> ${topicLabel}</p>
          <p><strong>From:</strong> ${email}</p>
          <hr />
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      })
    } catch (err) {
      console.error('[Contact] Failed to send message:', err)
      return fail(500, { error: 'Could not send your message. Please try again later.', topic, email, message })
    }

    return { success: true }
  },
}
