import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function categorizeTransaction(description: string): Promise<string> {
  console.log("🤖 AI categorization called with:", description)
  
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

  const prompt = `You are a financial categorization assistant. Given a transaction description, return ONLY the category name from this list:
- Groceries
- Transport
- Entertainment
- Dining
- Shopping
- Bills
- Healthcare
- Other

Transaction description: "${description}"

Return ONLY the category name, nothing else. No explanation, no punctuation.`

  try {
    console.log("📤 Sending request to Gemini...")
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    console.log("📥 Raw AI response:", response)
    
    const category = response.trim()
    console.log("✂️ Trimmed category:", category)
    
    // Validate the category is in our list
    const validCategories = ["Groceries", "Transport", "Entertainment", "Dining", "Shopping", "Bills", "Healthcare", "Other"]
    
    if (validCategories.includes(category)) {
      console.log("✅ Valid category found:", category)
      return category
    }
    
    console.log("⚠️ Invalid category, defaulting to Other. Got:", category)
    return "Other"
  } catch (error) {
    console.error("❌ AI categorization error:", error)
    return "Other"
  }
}

export async function generateMonthlyAdvice(transactions: {
  amount: number
  category: string
  description: string
  date: Date
}[]): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0)
  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const prompt = `You are a personal finance advisor. Analyze this spending data and provide exactly 3 actionable bullet points of advice.

Total spent: $${totalSpending.toFixed(2)}
Spending by category:
${Object.entries(categoryTotals).map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)}`).join('\n')}

Recent transactions:
${transactions.slice(0, 10).map(t => `- ${t.description} ($${t.amount}) - ${t.category}`).join('\n')}

Provide exactly 3 short, actionable bullet points (no bullet symbols, just numbered). Each should be 1-2 sentences max. Focus on practical savings tips.`

  try {
    const result = await model.generateContent(prompt)
    const advice = result.response.text().trim()
    
    // Split by newlines and filter out empty lines
    const points = advice.split('\n').filter(line => line.trim().length > 0)
    
    return points.slice(0, 3) // Ensure exactly 3 points
  } catch (error) {
    console.error("AI advice error:", error)
    return [
      "Track your daily expenses to identify spending patterns",
      "Set a monthly budget for each category",
      "Review your transactions weekly to stay on track"
    ]
  }
}