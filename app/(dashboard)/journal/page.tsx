import JournalCard from '@/components/JournalCard'
import NewJournal from '@/components/NewJournal'
import Question from '@/components/Question'
import { getUserByClerkId } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'
import Link from 'next/link'

const getJournals = async () => {
  const user = await getUserByClerkId()

  const journals = await prisma.journal.findMany({
    where: {
      userId: user.clerkId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return journals
}

const Journal = async () => {
  const journals = await getJournals()

  // type JournalDisplay = (typeof journals)[0] & { fullDate: string }

  const groupedJournals = journals.reduce((acc, journal) => {
    const journalDate = new Date(journal.createdAt)
    const fullDate = format(journalDate, 'EEEE, MMMM d, yyyy')
    let date: string

    if (isToday(journalDate)) {
      date = 'Today'
    } else if (isYesterday(journalDate)) {
      date = 'Yesterday'
    } else if (journalDate.getMonth() === new Date().getMonth()) {
      date = formatDistanceToNow(journalDate, { addSuffix: true })
    } else {
      date = fullDate
    }

    acc[`${date}|${fullDate}`] = [
      ...(acc[`${date}|${fullDate}`] || []),
      journal,
    ]
    return acc
  }, {} as { [key: string]: typeof journals })

  //? Alternative way for groubing with Object.groupBy
  // const groupedJournals = Object.groupBy(journals, (journal) =>
  //   new Date(journal.createdAt).toLocaleDateString()
  // )

  return (
    <div className="p-5">
      <h2 className="text-5xl mb-5">Journals</h2>
      <div className="flex gap-10 items-end mb-5">
        <NewJournal />
        <Question />
      </div>
      {Object.entries(groupedJournals).map(([date, journals]) => (
        <div className="timeline" key={date}>
          <div className="timelineHeader flex justify-between mb-6 text-[#785dc8]">
            <span className="text-2xl">{date.split('|')[0]}</span>
            <span className='text-lg'>{date.split('|')[1]}</span>
          </div>
          <div
            className={`grid place-items-center gap-4 mb-8
              ${journals.length === 1 ? 'grid-cols-1' : 'grid-cols-1'}
              `}
          >
            {journals?.map((journal) => (
              <Link
                className="w-fit"
                href={`/journal/${journal.id}`}
                key={journal.id}
              >
                <JournalCard key={journal.id} journal={journal} />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Journal
