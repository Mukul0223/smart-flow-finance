"use client"

import { useState, useEffect } from "react"
import { suggestCategory } from "../actions"

interface TransactionFormProps {
  onSubmit: (data: {
    amount: number
    category: string
    description: string
  }) => Promise<void>
}

const TransactionForm = ({ onSubmit }: TransactionFormProps) => {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false)

  // AI suggestion when description changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (description.trim().length >= 3 && !category) {
        setIsLoadingSuggestion(true)
        const suggestion = await suggestCategory(description)
        setAiSuggestion(suggestion)
        setIsLoadingSuggestion(false)
      }
    }, 1000) // Wait 1 second after user stops typing

    return () => clearTimeout(timer)
  }, [description, category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSubmit({
        amount: parseFloat(amount),
        category: category || aiSuggestion || "Other",
        description,
      })

      // Reset form
      setAmount("")
      setCategory("")
      setDescription("")
      setAiSuggestion(null)
    } catch (error) {
      console.error("Error submitting transaction:", error)
      alert("Failed to add transaction")
    } finally {
      setIsLoading(false)
    }
  }

  const acceptSuggestion = () => {
    if (aiSuggestion) {
      setCategory(aiSuggestion)
      setAiSuggestion(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount ($)
        </label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          placeholder="e.g., Whole Foods, Uber ride, Netflix"
        />
        {isLoadingSuggestion && (
          <p className="text-sm text-blue-600 mt-1">🤖 AI is thinking...</p>
        )}
      </div>

      {aiSuggestion && !category && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-gray-700 mb-2">
            🤖 AI suggests: <strong>{aiSuggestion}</strong>
          </p>
          <button
            type="button"
            onClick={acceptSuggestion}
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Use suggestion
          </button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category {category && <span className="text-green-600">✓</span>}
        </label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setAiSuggestion(null)
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
        >
          <option value="">
            {aiSuggestion ? "Or select manually..." : "Select category..."}
          </option>
          <option value="Groceries">🛒 Groceries</option>
          <option value="Transport">🚗 Transport</option>
          <option value="Entertainment">🎬 Entertainment</option>
          <option value="Dining">🍽️ Dining</option>
          <option value="Shopping">🛍️ Shopping</option>
          <option value="Bills">💡 Bills</option>
          <option value="Healthcare">⚕️ Healthcare</option>
          <option value="Other">📦 Other</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {isLoading ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  )
}

export default TransactionForm