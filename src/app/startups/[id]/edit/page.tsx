import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import EditStartupClient from '@/components/EditStartupClient'

export default async function EditStartupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const startup = await prisma.startup.findUnique({ where: { id } })
  if (!startup) notFound()

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser || startup.userId !== dbUser.id) redirect('/dashboard')

  return <EditStartupClient startup={startup} />
}