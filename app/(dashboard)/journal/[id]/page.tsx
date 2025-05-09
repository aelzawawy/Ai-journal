import { Analysis, Journal } from '@/app/generated/prisma'
import Editor from '@/components/Editor'
import { getUserByClerkId } from '@/utils/auth'
import { prisma } from '@/utils/db'
import React from 'react'

interface Props {
  params: {
    id: string
  }
}
interface JournalWithAnalysis extends Journal {
  analysis: Analysis
}

const getJournal = async (id: string) => {
  const user = await getUserByClerkId()
  const journal = await prisma.journal.findUnique({
    where: {
      id,
      userId: user.clerkId,
    },
    include: {
      analysis: true,
    },
  })
  return journal as JournalWithAnalysis
}

const EntryPage: React.FC<Props> = async ({ params }) => {
  const { id } = await Promise.resolve(params)
  const journal = await getJournal(id)

  return (
    <div className="w-full h-full">
      <Editor {...{ journal }} />
    </div>
  )
}

export default EntryPage
