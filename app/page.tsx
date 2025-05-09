import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()
  let href = userId ? '/journal' : '/new-user'

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-[600px]">
        <h1 className="text-6xl mb-3">Journal App</h1>
        <p className="text-2xl text-white/50 mb-4">
          An AI powered journal app for tracking your mood through out your life
        </p>
        <Link href={href}>
          <button className="p-2 rounded-lg bg-blue-600 text-2xl hover:cursor-pointer hover:bg-blue-700 transition-colors duration-200">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  )
}
