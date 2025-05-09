import HistoryChart from '@/components/HistoryChart'
import { getUserByClerkId } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getHistory = async () => {
  const { clerkId } = await getUserByClerkId()
  const analysis = await prisma.analysis.findMany({
    where: {
      userId: clerkId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
  const sum = analysis.reduce((acc, curr) => curr.sentimentScore + acc, 0)
  const avg = Math.round(sum / analysis.length)

  const chartData = analysis.map((el) => ({
    ...el,
    createdAt: new Date(el.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      weekday: 'long',
    }) as unknown as Date,
  }))
  return { chartData, avg }
}
const History = async () => {
  const { chartData, avg } = await getHistory()
  return (
    <div className="h-full w-full p-5">
      <HistoryChart analysis={chartData} avg={avg} />
    </div>
  )
}

export default History
