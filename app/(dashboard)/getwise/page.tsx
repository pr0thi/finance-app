"use client";
import { DataGrid } from "@/components/data-grid";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Card, CardHeader, CardContent } from "@/components/ui/card"; // ShadCN for styling
import Image from "next/image";

if (typeof window === "undefined") {
  require("dotenv").config();
}


export default function GetWise() {
  const { data, isLoading } = useGetSummary();
  const [aiResponse, setAiResponse] = useState(null); // To store AI response
  const [loading, setLoading] = useState(false); // To handle loading state
  const [userQuery, setUserQuery] = useState(""); // To store user query
  const [customAiResponse, setCustomAiResponse] = useState(null); // For custom query AI response
  const [showInput, setShowInput] = useState(false); // To toggle input box for "Ask AI"
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  async function generateAnswer(prompt: string){
    setLoading(true); // Start loading
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: prompt, // Accepting prompt as a parameter
                },
              ],
            },
          ],
        },
      });

      // Capture AI response
      const advice = response.data.candidates[0].content.parts[0].text;
      setAiResponse(advice); // Set AI response
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false); // End loading
    }
  }

  const financialAdvicePrompt = `
    My current financial summary:
    - Income: ₹${data?.incomeAmount}
    - Expenses: ₹${data?.expensesAmount}
    - Remaining Balance: ₹${data?.remainingAmount}
    - Categories spend: ${data?.categories
      .map((cat) => `${cat.name}: ₹${cat.value}`)
      .join(", ")}
    - Spending over days: ${data?.days
      .map(
        (day) =>
          `${new Date(day.date).toLocaleDateString()}: Income: ₹${
            day.income
          }, Expenses: ₹${day.expenses}`
      )
      .join("; ")}

    Please analyze the data and provide crisp financial planning advice in ₹. Suggest how I can improve savings, manage expenses, and optimize spending across categories.
  `;

  const customQueryPrompt = `
    Financial question: ${userQuery}
    My current financial summary:
    - Income: ₹${data?.incomeAmount}
    - Expenses: ₹${data?.expensesAmount}
    - Remaining Balance: ₹${data?.remainingAmount}
    - Categories spend: ${data?.categories
      .map((cat) => `${cat.name}: ₹${cat.value}`)
      .join(", ")}
    - Spending over days: ${data?.days
      .map(
        (day) =>
          `${new Date(day.date).toLocaleDateString()}: Income: ₹${
            day.income
          }, Expenses: ₹${day.expenses}`
      )
      .join("; ")}
  `;

  async function handleUserQuery() {
    if (userQuery.trim() === "") {
      return;
    }
    setLoading(true);
    await generateAnswer(customQueryPrompt);
    setCustomAiResponse(aiResponse);
    setLoading(false);
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />

      <div className="mt-4 flex space-x-4 justify-center">
        <button
          onClick={() => generateAnswer(financialAdvicePrompt)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? "Fetching advice..." : "Get AI Advice"}
        </button>

        <button
          onClick={() =>
            generateAnswer(
              `Based on my financial summary:
              My current financial summary:
    - Income: ₹${data?.incomeAmount}
    - Expenses: ₹${data?.expensesAmount}
    - Remaining Balance: ₹${data?.remainingAmount}
    - Categories spend: ${data?.categories
      .map((cat) => `${cat.name}: ₹${cat.value}`)
      .join(", ")}
    - Spending over days: ${data?.days
      .map(
        (day) =>
          `${new Date(day.date).toLocaleDateString()}: Income: ₹${
            day.income
          }, Expenses: ₹${day.expenses}`
      )
      .join("; ")}
              
              , suggest investment opportunities in ₹ to improve my financial health.
              `
            )
          }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Fetching advice..." : "Investment Opportunities"}
        </button>

        {/* Toggle input for user query */}
        <button
          onClick={() => setShowInput(!showInput)}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
        >
          {showInput ? "Hide Ask AI" : "Ask AI"}
        </button>
      </div>

      {/* Conditional rendering of input box */}
      {showInput && (
        <div className="mt-4 p-4 border border-gray-300 rounded shadow">
          <label
            htmlFor="user-query"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Ask a Financial Question
          </label>
          <input
            id="user-query"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Type your query..."
          />

          <button
            onClick={handleUserQuery}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
            disabled={loading || !userQuery}
          >
            {loading ? "Fetching answer..." : "Submit Query"}
          </button>
        </div>
      )}

      {/* AI Response display */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center mt-4">
            <Image
              src="/logo.svg"
              alt="Loading"
              width={100}
              height={100}
              className="animate-spin-slow"
            />
          </div>
        ) : (
          aiResponse && (
            <Card className="mt-6 p-6 bg-gray-50 shadow-inner rounded-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold text-center text-green-600">
                  AI Financial Planning Advice
                </h3>
              </CardHeader>
              <CardContent className="prose prose-green">
                <ReactMarkdown className="prose">{aiResponse}</ReactMarkdown>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Custom AI response */}
      {customAiResponse && (
        <div className="mt-6">
          <Card className="p-4 bg-white shadow-lg rounded">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-700">
                AI Response to Your Query
              </h3>
            </CardHeader>
            <CardContent>
              <ReactMarkdown className="prose">
                {customAiResponse}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
