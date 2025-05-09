'use client'

import { createNewJournal } from '@/utils/api'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const NewJournal = () => {
  const { userId } = useAuth()
  const [clicked, setClicked] = useState(false)
  const router = useRouter()
  const handleClick = async () => {
    if (clicked) return
    setClicked(true)
    const journal = await createNewJournal(userId as string)
    router.push(`/journal/${journal.id}`)
    router.refresh()
  }

  return (
    <div className="bg-zinc-800 hover:bg-zinc-700/20 transition-all duration-75 p-4 rounded-lg w-fit">
      <button
        onClick={handleClick}
        disabled={clicked}
        className="px-5 py-4 text-3xl cursor-pointer font-bold whitespace-nowrap  disabled:cursor-not-allowed disabled:text-zinc-400"
      >
        {!clicked? 'New Entry ➕': 'Loading...'}
      </button>
    </div>
  )
}

export default NewJournal
