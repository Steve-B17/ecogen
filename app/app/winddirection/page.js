import React from 'react'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 px-4 min-h-screen max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Wind Direction Analysis</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Wind direction monitoring and analysis tools will be displayed here.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}