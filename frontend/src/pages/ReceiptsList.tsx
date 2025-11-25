import React, {useEffect, useRef, useState} from "react";
import API from "../api/axios";
import {Link} from "react-router-dom";

export default function ReceiptsList() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchReceipts();
    }
  }, []);

  async function fetchReceipts() {
    setLoading(true);
    try {
      const {data} = await API.get("/receipts");
      setReceipts(data.receipts || []);
    } catch (err) {
      alert("Failed to load receipts");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your receipts</h2>
        <Link
          to="/receipts/new"
          className="px-3 py-2 rounded-lg bg-brand-500 text-white text-sm"
        >
          New receipt
        </Link>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-50">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

        {/* Text */}
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Preparing your Receipt List
        </div>
      </div>
        ) : receipts.length === 0 ? (
          <div className="card text-center text-gray-500">
            No receipts yet. Upload your first receipt.
          </div>
        ) : (
          receipts.map((r) => (
            <Link
              key={r._id}
              to={`/receipts/${r._id}`}
              className="card flex items-center gap-4 hover:shadow-md transition"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500 overflow-hidden">
                {r.imageUrl ? (
                  <img
                    src={
                      (
                        process.env.REACT_APP_API_URL ||
                        "http://localhost:4000/api"
                      ).replace("/api", "") + r.imageUrl
                    }
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="./receipt.png"
                    alt="placeholder"
                    className="w-full h-full object-cover"
                  />
                )}{" "}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-green-600 font-semibold">
                    ₹{r.amount}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(r.date).toLocaleDateString()} · {r.category}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
