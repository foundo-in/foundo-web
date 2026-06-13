import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { role } = await req.json()

  const validRoles = ['FOUNDER', 'INVESTOR', 'STUDENT', 'BUILDER']
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  try {
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: { role },
      create: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        role,
      },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}