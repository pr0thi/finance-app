"use client";
import { DataGrid } from "@/components/data-grid";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardHeader, CardContent } from "@/components/ui/card"; // ShadCN for styling
import Image from "next/image";
import { 
  generateFinancialAdvice, 
  generateInvestmentAdvice, 
  answerCustomQuery 
} from "./advisoryEngine";

export default function GetWise() {
  const { data, isLoading } = useGetSummary();
  const [aiResponse, setAiResponse] = useState(null); // To store AI response
  const [loading, setLoading] = useState(false); // To handle loading state
  const [userQuery, setUserQuery] = useState(""); // To store user query
  const [customAiResponse, setCustomAiResponse] = useState(null); // For custom query AI response
  const [showInput, setShowInput] = useState(false); // To toggle input box for "Ask AI"

  // Function to generate advice using our rule-based system
  async function generateAdvice(type: string) {
    if (!data) return;
    
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      let advice;
      
      switch (type) {
        case 'financial':
          advice = generateFinancialAdvice(data);
          break;
        case 'investment':
          advice = generateInvestmentAdvice(data);
          break;
        default:
          advice = "Please select a valid advice type.";
      }
      
      setAiResponse(advice);
      setLoading(false);
    }, 800); // Simulate loading time for better UX
  }

  // Handle custom user query
  async function handleUserQuery() {
    if (userQuery.trim() === "") {
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const response = answerCustomQuery(userQuery, data);
      setCustomAiResponse(response);
      setLoading(false);
    }, 800); // Simulate loading time for better UX
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />

      <div className="mt-4 flex space-x-4 justify-center">
        <button
          onClick={() => generateAdvice('financial')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          disabled={loading || isLoading}
        >
          {loading ? "Fetching advice..." : "Get AI Advice"}
        </button>

        <button
          onClick={() => generateAdvice('investment')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          disabled={loading || isLoading}
        >
          {loading ? "Fetching advice..." : "Investment Opportunities"}
        </button>

        {/* Toggle input for user query */}
        <button
          onClick={() => setShowInput(!showInput)}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          disabled={isLoading}
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

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center mt-4">
          <Image
            src="/logo.svg"
            alt="Loading"
            width={100}
            height={100}
            className="animate-spin-slow"
          />
        </div>
      )}

      {/* AI Response display */}
      {!loading && aiResponse && (
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
      )}

      {/* Custom AI response */}
      {!loading && customAiResponse && (
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