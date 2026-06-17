import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/* ── GET — fetch own profile ──────────────────────────────── */
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { profile: true },
    })
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ user: dbUser, profile: dbUser.profile })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

/* ── PATCH — upsert profile + city on User ────────────────── */
export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clerkUser = await currentUser()
  if (!clerkUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body = await req.json()
  const { city, bio, lookingFor, linkedin, twitter } = body as {
    city?: string
    bio?: string
    lookingFor?: string[]
    linkedin?: string
    twitter?: string
  }

  try {
    // Ensure the user row exists (first-time safety)
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { city: city ?? undefined },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
        city,
      },
    })

    // Upsert the Profile row
    const profile = await prisma.profile.upsert({
      where: { userId: dbUser.id },
      update: {
        bio:        bio        ?? undefined,
        lookingFor: lookingFor ?? undefined,
        linkedin:   linkedin   ?? undefined,
        twitter:    twitter    ?? undefined,
      },
      create: {
        userId:    dbUser.id,
        bio:       bio       ?? '',
        lookingFor: lookingFor ?? [],
        linkedin:  linkedin  ?? '',
        twitter:   twitter   ?? '',
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
