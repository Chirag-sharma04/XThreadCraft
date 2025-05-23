"use client"

import { ThreadComposer } from "./thread-composer"
import { SavedThreads } from "./saved-threads"
import { ThreadManager } from "./thread-manager"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TurnstileWrapper } from "./turnstile-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "sonner"
export default function ThreadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [turnstileActive, setTurnstileActive] = useState(false)
  const [activeTab, setActiveTab] = useState("compose")

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted dark:bg-background">
      <div onClick={() => setTurnstileActive(true)} className="w-full max-w-4xl mx-auto mb-6 p-4 mt-10 cursor-pointer">
        {turnstileActive ? (
          <div className="w-full max-w-4xl mx-auto mb-6 p-4">
            <TurnstileWrapper>
              <iframe
                id="taskade-chat"
                src="https://www.taskade.com/a/01JN5HMQW32K268B8909VY4DK0"
                width="100%"
                height="400"
                frameBorder="0"
                className="rounded-lg shadow-lg bg-white border border-gray-200 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                allow="clipboard-read; clipboard-write"
                allowFullScreen
              />
            </TurnstileWrapper>
          </div>
        ) : (
          <div className="rounded-lg shadow-lg bg-white border border-gray-200 p-6 text-center text-black">
            Click to verify and load chat
          </div>
        )}
      </div>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose Thread</TabsTrigger>
            <TabsTrigger value="saved">Saved Threads</TabsTrigger>
            <TabsTrigger value="manage">Manage Threads</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-6">
            <ThreadComposer />
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <SavedThreads />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <ThreadManager />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}

