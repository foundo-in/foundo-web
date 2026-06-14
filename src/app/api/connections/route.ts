import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Send email notification
    await resend.emails.send({
      from: 'Foundo.in <onboarding@resend.dev>',
      to: startup.user.email,
      subject: `New connection request for ${startup.name}`,
      html: `
        <div style="font-family: Helvetica Neue, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #111;">
          <div style="margin-bottom: 32px;">
            <span style="background: #E84A00; color: white; font-weight: 900; font-size: 18px; padding: 6px 14px; border-radius: 6px;">Foundo.in</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 8px; letter-spacing: -0.5px;">New connection request</h1>
          <p style="color: #4B5563; margin-bottom: 32px;">Someone wants to connect with <strong>${startup.name}</strong>.</p>
          
          <div style="background: #FAFAFA; border: 1px solid #E5E7EB; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
            <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">${fromUser.name}</div>
            <div style="color: #6B7280; font-size: 13px; margin-bottom: ${message ? '16px' : '0'};">${fromUser.role} ${fromUser.city ? `· ${fromUser.city}` : ''}</div>
            ${message ? `<p style="color: #1A1A1A; font-size: 14px; line-height: 1.6; border-top: 1px solid #E5E7EB; padding-top: 16px; margin: 0;">"${message}"</p>` : ''}
          </div>

          <a href="mailto:${fromUser.email}" style="display: inline-block; background: #E84A00; color: white; padding: 12px 28px; border-radius: 7px; font-weight: 700; font-size: 14px; text-decoration: none; margin-bottom: 32px;">
            Reply to ${fromUser.name} →
          </a>

          <p style="color: #9CA3AF; font-size: 12px;">
            You can also view all requests at <a href="https://foundo-web.vercel.app/connections" style="color: #E84A00;">foundo.in/connections</a>
          </p>
        </div>
      `
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
        startup: { select: { name: true, id: true } },
        toUser: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ received, sent })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}