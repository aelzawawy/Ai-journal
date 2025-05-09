'use client'

import { Analysis } from '@/app/generated/prisma'
import React from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface HistoryChartProps {
  analysis: Analysis[]
  avg: number
}

const ToolTip = ({ payload, label, active }: any) => {
  const dateLabel = new Date(label).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  if (active && payload && payload.length) {
    const analysis = payload[0].payload
    return (
      <div
        className="border-gray-300 p-5 rounded text-black"
        style={{ backgroundColor: `${analysis?.color}c0` }}
      >
        <p className="text-sm">{dateLabel}</p>
        <p className="text-lg font-bold">{analysis.mood}</p>
      </div>
    )
  }
  return null
}
const HistoryChart: React.FC<HistoryChartProps> = ({ analysis, avg }) => {
  return (
    <div className="h-full flex gap-3 flex-col items-center justify-center">
      <h2 className="text-xl font-bold">Average Sentiment Score {avg}</h2>

      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={analysis}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <Line
              type="monotone"
              dataKey="sentimentScore"
              stroke="#785dc8"
              activeDot={{ r: 8 }}
            />
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="createdAt" />
            <YAxis />
            <Legend />
            <Tooltip content={<ToolTip />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default HistoryChart
