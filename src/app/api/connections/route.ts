import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { startupId, message } = await req.json()
  if (!startupId) return NextResponse.json({ error: 'Missing startupId' }, { status: 400 })

  try {
    const fromUser = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!fromUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: { user: true }
    })
    if (!startup) return NextResponse.json({ error: 'Startup not found' }, { status: 404 })

    if (startup.userId === fromUser.id) {
      return NextResponse.json({ error: 'Cannot connect to your own startup' }, { status: 400 })
    }

    const existing = await prisma.connection.findFirst({
      where: { fromUserId: fromUser.id, startupId }
    })
    if (existing) return NextResponse.json({ error: 'Already requested' }, { status: 400 })

    const connection = await prisma.connection.create({
      data: {
        fromUserId: fromUser.id,
        toUserId: startup.userId,
        startupId,
        message,
      }
    })

    return NextResponse.json({ success: true, connection })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const received = await prisma.connection.findMany({
      where: { toUserId: user.id },
      include: {
        fromUser: { select: { name: true, email: true, city: true, role: true } },
        startup: { select: { name: true, id: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const sent = await prisma.connection.findMany({
      where: { fromUserId: user.id },
      include: {
        toUser: { select: { name: true, email: true } },
        startup: { select: { name: true, id: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ received, sent })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}