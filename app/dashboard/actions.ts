"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { categorizeTransaction } from "@/lib/gemini"
import { generateMonthlyAdvice } from "@/lib/gemini"

export async function suggestCategory(description: string) {
  "use server"
  
  if (!description || description.trim().length < 3) {
    return null
  }

  try {
    const category = await categorizeTransaction(description)
    return category
  } catch (error) {
    console.error("Error suggesting category:", error)
    return null
  }
}

export async function createTransaction(data: {
  amount: number
  category: string
  description: string
}) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Create the transaction
  await prisma.transaction.create({
    data: {
      amount: data.amount,
      category: data.category,
      description: data.description,
      userId: user.id,
    },
  })

  // Revalidate the dashboard to show new data
  revalidatePath("/dashboard")
}

export async function getTransactions() {
  const session = await auth()

  if (!session?.user?.email) {
    return []
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      transactions: {
        orderBy: {
          date: "desc",
        },
      },
    },
  })

  return user?.transactions || []
}

export async function deleteTransaction(id: string) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  await prisma.transaction.delete({
    where: { id },
  })

  revalidatePath("/dashboard")
}

export async function getAIAdvice() {
  const transactions = await getTransactions()
  
  if (transactions.length < 3) {
    return ["Add at least 3 transactions to get personalized advice!"]
  }

  const advice = await generateMonthlyAdvice(transactions)
  return advice
}