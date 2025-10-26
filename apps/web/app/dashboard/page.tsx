import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  // Fetch auth info and the current user on the server
  const [{ userId }, user] = await Promise.all([auth(), currentUser()])

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome — this page is protected and rendered server-side.</p>
      <p className="mt-2 text-sm text-muted-foreground">Your user id: {user?.id}</p>
      <p className="mt-1 text-sm">{user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress}</p>
    </div>
  )
}
