"use client";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // ShadCN for styling
import Image from "next/image";
if (typeof window === "undefined") {
  require("dotenv").config();
}

export default function GetWise() {
  const [aiResponse, setAiResponse] = useState(null); // To store AI response
  const [loading, setLoading] = useState(false); // To handle loading state
  const [formData, setFormData] = useState({
    designation: "",
    incomeSources: "",
    salary: "",
    otherIncome: "",
    capitalGains: "",
  }); // To store form data

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  async function generateAnswer(prompt) {
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
                  text: prompt, // Passing prompt with user data
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

  // Handler to update form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler to generate tax-saving advice based on user input
  const handleGenerateTaxAdvice = () => {
    const { designation, incomeSources, salary, otherIncome, capitalGains } =
      formData;
    const taxSavingPrompt = `
      I work as a ${designation} and my salary is ₹${salary}.
      I also have income from ${incomeSources} such as ₹${otherIncome}.
      Additionally, I have capital gains of ₹${capitalGains}.
      Suggest some tax-saving tips and financial planning strategies.
    `;
    generateAnswer(taxSavingPrompt);
  };

  return (
    <div className="relative mb-10 z-10 p-6 max-w-3xl mx-auto -mt-36">
      <Card className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Get Your Personalized Tax Saving Tips
          </h2>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Salary (₹)
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Income from Other Sources
              </label>
              <input
                type="text"
                name="incomeSources"
                value={formData.incomeSources}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Other Income (₹)
              </label>
              <input
                type="text"
                name="otherIncome"
                value={formData.otherIncome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Capital Gains (₹)
              </label>
              <input
                type="text"
                name="capitalGains"
                value={formData.capitalGains}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </form>

          {/* Button to generate tax-saving advice */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleGenerateTaxAdvice}
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition focus:ring-2 focus:ring-green-500 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Fetching Tax Tips..." : "Get Tax Saving Tips"}
            </button>
          </div>
        </CardContent>

        {/* AI response rendering */}
        <CardFooter>
          {loading ? (
            <div className="flex justify-center items-center mt-4">
              <Image
                src="/logo.svg"
                alt="Loading"
                width={100}
                height={100}
                className="animate-spin-slow justify-center items-center"
              />
            </div>
          ) : (
            aiResponse && (
              <Card className="mt-6 p-6 bg-gray-50 shadow-inner rounded-lg">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-center text-green-600">
                    AI Tax Saving Advice
                  </h3>
                </CardHeader>
                <CardContent className="prose prose-green">
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </CardContent>
              </Card>
            )
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
