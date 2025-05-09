import { prisma } from '@/utils/db'
import { Params } from 'next/dist/server/request/params'
import { NextResponse } from 'next/server'

interface Param {
  params: Params
}
export const PATCH = async (req: Request, { params }: Param) => {
  const { id } = await Promise.resolve(params)
  const { userId, content } = await req.json()

  const newJournal = await prisma.journal.update({
    where: {
      id: id as string,
      userId,
    },
    data: {
      content,
    },
  })

  return NextResponse.json({ newJournal })
}
