import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body = await req.json()
  const { name, tagline, description, stage, city, tags, lookingFor, website, linkedin } = body

  if (!name || !tagline || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!dbUser) return NextResponse.json({ error: 'User not found in DB' }, { status: 404 })

    const startup = await prisma.startup.create({
      data: {
        userId: dbUser.id,
        name,
        tagline,
        description,
        stage: stage || 'IDEA',
        city,
        tags: tags || [],
        lookingFor: lookingFor || [],
        website,
        linkedin,
      },
    })

    return NextResponse.json({ success: true, startup })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const startups = await prisma.startup.findMany({
      where: { isPublished: true },
      include: {
        user: {
          select: { name: true, city: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ startups })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}