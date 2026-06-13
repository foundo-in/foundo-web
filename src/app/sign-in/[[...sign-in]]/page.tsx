import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <SignIn />
    </main>
  )
}