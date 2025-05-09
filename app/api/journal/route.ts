import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  const { userId, content } = await req.json()
  const journal = await prisma.journal.create({
    data: {
      content,
      userId,
    },
  })

  return NextResponse.json({ journal })
}
