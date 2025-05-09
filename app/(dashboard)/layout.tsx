import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React, { ReactNode } from 'react'
interface Props {
  children: ReactNode
}
const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex">
      <aside className="w-1/5 h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <nav className="mt-4">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/journal"
                  className="text-white text-4xl font-semibold hover:text-[#785dc8] transition-colors duration-200"
                >
                  Journal
                </Link>
              </li>
               <li>
                <Link
                  href="/history"
                  className="text-white text-4xl font-semibold hover:text-[#785dc8] transition-colors duration-200"
                >
                  History
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="h-full flex-1">
        <header className="flex border-b-2 border-l-2 border-zinc-200 text-white p-5">
          <div className="flex flex-1 items-center justify-end mr-5">
            <UserButton
              showName
              appearance={{
                elements: {
                  avatarBox: 'scale-170',
                  userButtonOuterIdentifier: { fontSize: 24 },
                  userButtonBox: { gap: '20px' },
                },
              }}
            />
          </div>
        </header>
        <div className="h-[calc(100vh-75px)] flex flex-col border-l-2 border-zinc-200 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout
