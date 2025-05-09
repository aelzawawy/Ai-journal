'use client'
import { askQuestion } from '@/utils/api'
import { FormEvent, useState } from 'react'

const Question = () => {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('loading...')
  const [answer, setAnswer] = useState('')
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!question) return
    setLoading(true)
    setAnswer('')
    const loadingTimeout = setTimeout(() => {
      setLoadingMsg('This is might take a while...')
    }, 5000)

    const { ok, message, answer } = await askQuestion(question)

    clearTimeout(loadingTimeout)
    setLoadingMsg('loading...')
    setAnswer(answer)
    if (!ok) {
      alert(message)
      setLoading(false)
      return
    }

    setAnswer(answer)
    setLoading(false)
  }

  return (
    <div className="flex gap-10">
      <div className="flex flex-col gap-2 shrink-0">
        <form {...{ onSubmit }}>
          <input
            type="text"
            name="question"
            placeholder="Ask a question"
            value={question}
            disabled={loading}
            onChange={(e) => setQuestion(e.target.value)}
            className="bg-zinc-800 px-5 py-9 min-w-[200px] max-w-[400px] field-sizing-content text-xl outline-0 rounded-lg mr-2 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-400 text-zinc-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-9 text-xl rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-400"
          >
            Ask
          </button>
        </form>
        {loading && (
          <div className="rounded-lg border border-zinc-400 px-2">
            {loadingMsg}
          </div>
        )}
      </div>
      {answer && (
        <div className="rounded-lg border border-zinc-400 p-2">
              <p className="text-zinc-200 ">Answer: {answer}</p>
        </div>
      )}
    </div>
  )
}

export default Question
