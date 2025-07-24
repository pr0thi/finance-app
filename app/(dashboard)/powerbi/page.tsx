"use client";

const PowerBi = () => {
  return (
    <div className="relative mb-10 z-10 p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto -mt-36">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Financial Report
      </h1>

      {/* PDF Display Section */}
      <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Power BI Report (PDF)
        </h2>
        <iframe
          src="/power.pdf"
          width="100%"
          height="500px"
          className="border-2 border-gray-300 rounded-lg"
          style={{ border: "none" }}
        ></iframe>

        {/* Download Link styled as Button */}
        <div className="mt-4 text-center">
          <a
            href="/power.pdf"
            download="Financial_Report.pdf"
            className="inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
};

export default PowerBi;
