import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [showSupport, setShowSupport] = useState(false);

  return (
    <div className="h-full bg-gray-800 text-white flex flex-col justify-between">
      {/* Sidebar navigation */}
      <div>
        <h2 className="text-xl font-bold p-4">Plant2Tree</h2>
        <nav className="flex flex-col p-4 space-y-2">
          <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">
            Dashboard
          </Link>
          <Link to="/patients" className="hover:bg-gray-700 p-2 rounded">
            Patients
          </Link>
          <Link to="/billing" className="hover:bg-gray-700 p-2 rounded">
            Billing
          </Link>
          <Link to="/reports" className="hover:bg-gray-700 p-2 rounded">
            Reports
          </Link>
        </nav>
      </div>

      {/* Support + Logout */}
      <div className="p-4 space-y-2">
        <button
          onClick={() => setShowSupport(true)}
          className="bg-blue-500 w-full py-2 rounded"
        >
          Get Support
        </button>
        <button className="bg-red-500 w-full py-2 rounded">Logout</button>
      </div>

      {/* Support Popup */}
      {showSupport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-2">Need Help?</h2>
            <p className="mb-2">Call us on: +91 XXXXXXXXXX</p>
            <p className="mb-2">
              We will connect via AnyDesk to fix your issue remotely.
            </p>
            <p className="mb-4">
              <a
                href="https://anydesk.com/en/downloads"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Download AnyDesk
              </a>
            </p>
            <button
              onClick={() => setShowSupport(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
