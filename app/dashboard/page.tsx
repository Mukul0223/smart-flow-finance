import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import TransactionForm from "./components/TransactionForm"
import { createTransaction, getTransactions, deleteTransaction, getAIAdvice } from "./actions"
import AIAdvice from "./components/AIAdvice"

const DashboardPage = async () => {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const transactions = await getTransactions()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logout */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Smart Flow Finance</h1>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-6xl mx-auto p-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {session.user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Email: {session.user.email}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Add Transaction */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add Transaction
            </h3>
            <TransactionForm onSubmit={createTransaction} />
          </div>

          {/* Right Column: Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Transactions
            </h3>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No transactions yet. Add your first expense!
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg text-gray-800">
                          ${transaction.amount.toFixed(2)}
                        </span>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {transaction.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        {transaction.description}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <form
                      action={async () => {
                        "use server"
                        await deleteTransaction(transaction.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Advice Section - Only show if user has 3+ transactions */}
        {transactions.length >= 3 && (
          <div className="mt-6">
            <AIAdvice getAdvice={getAIAdvice} />
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardPage