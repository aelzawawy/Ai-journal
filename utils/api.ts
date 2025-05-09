import { Analysis } from '@/app/generated/prisma'

const createURL = (path: string) => {
  return `${window.location.origin}${path}`
}

export const createNewJournal = async (userId: string) => {
  const res = await fetch(new Request(createURL('/api/journal')), {
    method: 'POST',
    body: JSON.stringify({
      userId,
      content: '',
    }),
  })

  if (res.ok) {
    const { journal } = await res.json()
    return journal
  }
}

export const updateJournal = async (
  userId: string,
  id: string,
  content: string
) => {
  const res = await fetch(new Request(createURL(`/api/journal/${id}`)), {
    method: 'PATCH',
    body: JSON.stringify({ userId, content }),
  })

  if (res.ok) {
    const { newJournal } = await res.json()
    return newJournal
  }
}

interface AnalysisResponse {
  ok: boolean
  message: string
  analysis: Analysis
}

export const analyzeJournal = async (
  userId: string,
  id: string,
  content: string
) => {
  const res = await fetch(new Request(createURL(`/api/analysis`)), {
    method: 'POST',
    body: JSON.stringify({ id, userId, content }),
  })

  const { ok, message, analysis } = (await res.json()) as AnalysisResponse

  return { ok, message, analysis }
}

export const askQuestion = async (question: string) => {
  const res = await fetch(
    new Request(createURL('/api/question'), {
      method: 'POST',
      body: JSON.stringify({ question }),
    })
  )

  const { ok, message, answer } = await res.json()
  return { ok, message, answer }
}
