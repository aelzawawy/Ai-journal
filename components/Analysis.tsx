'use client'
import { Analysis } from '@/app/generated/prisma'
import React from 'react'

interface Props {
  analysis: Analysis
  message?: string
}

const AnalysisComponent: React.FC<Props> = ({ analysis, message }) => {
  const analysisData = [
    { name: 'Summary', value: analysis?.summary || '' },
    { name: 'Subject', value: analysis?.subject || '' },
    { name: 'Mood', value: analysis?.mood || '' },
    { name: 'Negative', value: analysis?.negative ? 'True' : 'False' },
  ]

  return (
    <div className="col-span-1 bg-zinc-400/10 border mt-5 mb-5 mr-5 p-5 rounded-lg">
      <h2
        className="bg-white/10 text-zinc-900 text-5xl px-5 py-2 rounded-lg mb-3"
        style={{ backgroundColor: `${analysis?.color}c0` }}
      >
        Analysis
      </h2>

      <div>
        <ul className="bg-white/10 px-5 py-2 rounded-lg divide-y divide-zinc-400">
          {analysisData.map(({ name, value }, i) => (
            <li key={i} className="flex flex-wrap items-center p-2">
              <span className="font-bold pr-3">{name} :</span>
              <span className="">{value}</span>
            </li>
          ))}
        </ul>

        {message && message !== 'Success' && message !== 'Analyzing' && (
          <div className="p-2">
            {(message !== 'init' && (
              <details className="bg-red-500/50 rounded-lg px-2">
                <summary className="select-none cursor-pointer">Error!</summary>
                <p>{message}</p>
              </details>
            )) || (
              <div className="border border-zinc-400 rounded-lg text-xl text-center p-2">
                Edit the journal to start analyzing!
              </div>
            )}
          </div>
        )}
        {message === 'Analyzing' && (
          <div className="p-2">
            <div className="bg-blue-300/50 rounded-lg px-2">Analyzing...</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalysisComponent
