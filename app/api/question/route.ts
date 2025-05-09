import { qa } from '@/utils/ai'
import { getUserByClerkId } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  try {
    const { question } = await req.json()
    const user = await getUserByClerkId()

    const journals = await prisma.journal.findMany({
      where: {
        userId: user.clerkId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const answer = await qa(question, journals)

    return NextResponse.json({ ok: true, message: 'Success', answer })
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message })
  }
}
