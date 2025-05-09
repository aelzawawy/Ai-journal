import { Journal } from '@/app/generated/prisma'
import React from 'react'
interface Props {
  journal: Journal
}
const JournalCard: React.FC<Props> = ({ journal }) => {
  return (
    <div className="relative min-w-100 md:w-150 xl:w-200 bg-white/5 shadow-md rounded-lg p-2 pb-6 mb-2 shadow-white/10 hover:shadow-[#785dc8] transition-shadow duration-200">
      <p className="text-zinc-300 text-2xl text-balance line-clamp-2">
        {journal.content}
      </p>
      <p className="text-[#785dc8] text-lg absolute bottom-0 right-4">
        {new Date(journal.createdAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  )
}

export default JournalCard
