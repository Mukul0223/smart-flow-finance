"use client"

import { useState } from "react"

interface AIAdviceProps {
  getAdvice: () => Promise<string[]>
}

const AIAdvice = ({ getAdvice }: AIAdviceProps) => {
  const [advice, setAdvice] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGetAdvice = async () => {
    setIsLoading(true)
    try {
      const result = await getAdvice()
      setAdvice(result)
    } catch (error) {
      console.error("Error getting advice:", error)
      alert("Failed to get AI advice")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🤖 AI Financial Advisor
      </h3>
      
      {!advice ? (
        <button
          onClick={handleGetAdvice}
          disabled={isLoading}
          className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? "🤖 AI is analyzing..." : "Get AI Spending Advice"}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 space-y-3">
            {advice.map((point, index) => (
              <div key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <p className="text-gray-700 flex-1">{point}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleGetAdvice}
            disabled={isLoading}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            🔄 Refresh advice
          </button>
        </div>
      )}
    </div>
  )
}

export default AIAdvice