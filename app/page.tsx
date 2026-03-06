import { auth } from "@/auth"
import Link from "next/link"

const HomePage = async () => {
  const session = await auth()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          💰 Smart Flow Finance
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-Powered Expense Tracking
        </p>
        
        {session?.user ? (
          <Link
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Go to Dashboard →
          </Link>
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Get Started →
          </Link>
        )}
      </div>
    </div>
  )
}

export default HomePage