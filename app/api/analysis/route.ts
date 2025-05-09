import { analyze } from '@/utils/ai'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  try {
    const { id, userId, content } = await req.json()

    const analysis = await analyze(content)

    const updatedAnalysis = await prisma.analysis.upsert({
      where: {
        journalId: id as string,
      },
      create: {
        userId,
        journalId: id as string,
        ...analysis,
      },
      update: analysis,
    })

    return NextResponse.json({
      ok: true,
      message: 'Success',
      analysis: updatedAnalysis,
    })
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message })
  }
}
