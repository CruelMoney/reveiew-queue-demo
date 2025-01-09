"use client";

import { useState } from "react";

interface ReportButtonProps {
  profileId: string;
  reportAction: (profileId: string) => Promise<void>;
}

export function ReportButton({ profileId, reportAction }: ReportButtonProps) {
  const [isReporting, setIsReporting] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = async () => {
    try {
      setIsReporting(true);
      await reportAction(profileId);
      setReported(true);
    } catch (error) {
      console.error("Error reporting profile:", error);
    } finally {
      setIsReporting(false);
    }
  };

  if (reported) {
    return (
      <button
        disabled
        className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
      >
        Profile Reported
      </button>
    );
  }

  return (
    <button
      onClick={handleReport}
      disabled={isReporting}
      className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors ${
        isReporting ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isReporting ? "Reporting..." : "Report Profile"}
    </button>
  );
}
