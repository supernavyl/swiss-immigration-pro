"use client";

import { ArrowLeft } from "lucide-react";

export default function NotFoundBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Go Back
    </button>
  );
}
