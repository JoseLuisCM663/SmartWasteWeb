import { getUser } from "@/app/actions/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return <DashboardLayout user={user} />
}
