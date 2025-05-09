'use client'

import { Analysis, Journal } from '@/app/generated/prisma'
import { analyzeJournal, updateJournal } from '@/utils/api'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useAutosave } from 'react-autosave'
import AnalysisComponent from './Analysis'
import { useAuth } from '@clerk/nextjs'

interface JournalWithAnalysis extends Journal {
  analysis: Analysis
}
interface Props {
  journal: JournalWithAnalysis
}
const Editor: React.FC<Props> = ({ journal }) => {
  const { userId } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState(journal.content)
  const [isSaving, setIsSaving] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis>(journal.analysis)
  const [message, setmessage] = useState<string>('init')

  useAutosave({
    data: content,
    onSave: async (_content) => {
      if (_content.trim() === '') return // Prevent empty editor from saving
      if (
        /^\s+|\s+$/g.test(_content) &&
        _content.trim() === journal.content.trim()
      )
        return // Prevent extra white space without changing content from saving

      setIsSaving(true)
      const { content } = await updateJournal(
        userId as string,
        journal.id,
        _content
      )

      setIsSaving(false)
      setmessage('Analyzing')

      const { message, analysis } = await analyzeJournal(
        userId as string,
        journal.id,
        content
      )

      router.refresh()
      setAnalysis(analysis)
      setmessage(message)
    },
    interval: 3000,
  })

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2 p-5">
        <div className="relative w-full flex flex-col justify-center">
          {isSaving && (
            <div className="absolute right-1 bottom-1">Saving...</div>
          )}
          <textarea
            className="field-sizing-content caret-white resize-none border border-zinc-400 rounded-lg bg-white/5 p-5 text-2xl"
            name="content"
            value={content}
            placeholder="Write about your day..."
            autoFocus
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
      </div>
      <AnalysisComponent {...{ analysis, message }} />
    </div>
  )
}

export default Editor
