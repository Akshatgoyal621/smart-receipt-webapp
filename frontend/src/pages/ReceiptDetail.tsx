import React, {useEffect, useRef, useState, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import API from "../api/axios";
import {useNotify} from "../components/NotificationBus";

// Constants
const BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:4000/api"
).replace("/api", "");

const FALLBACK_IMAGE = "/receipt.png";

// Types
interface Receipt {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  imageUrl?: string;
}

type ReceiptApiResponse = Receipt;

export default function ReceiptDetail() {
  const {id} = useParams<{id: string}>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  const notify = useNotify();
  const nav = useNavigate();
  const fetchedRef = useRef(false);

  // Fetch Once
  const fetchReceipt = useCallback(async () => {
    if (!id) return;

    try {
      const {data} = await API.get<ReceiptApiResponse>(`/receipts/${id}`);
      setReceipt(data);
    } catch (error) {
      console.error("Failed to load receipt:", error);

      notify({
        title: "Load Failed",
        message: "Unable to load this receipt. Redirecting...",
      });

      setTimeout(() => nav("/receipts"), 10);
    } finally {
      setLoading(false);
    }
  }, [id, nav, notify]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchReceipt();
  }, [fetchReceipt]);

  // DELETE RECEIPT 
  const removeReceipt = async () => {
    if (!id) return;

    const ok = window.confirm("Delete this receipt?");
    if (!ok) return;

    try {
      await API.delete(`/receipts/${id}`);

      notify({
        title: "Receipt Deleted",
        message: "The receipt was deleted successfully.",
      });

      setTimeout(() => nav("/receipts"), 10);
    } catch (error) {
      console.error("Delete failed:", error);

      notify({
        title: "Delete Failed",
        message: "We couldn't delete the receipt. Try again later.",
      });
    }
  };

  // UI States
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-50">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

        {/* Text */}
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Preparing your Receipt Details
        </div>
      </div>
    );
  }
  if (!receipt) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card text-gray-500">Receipt not found.</div>
      </div>
    );
  }

  const imageSrc = receipt.imageUrl
    ? BASE_URL + receipt.imageUrl
    : FALLBACK_IMAGE;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Image */}
          <div className="w-full md:w-56 h-56 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={imageSrc}
              alt="receipt"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{receipt.title}</h3>

            <div className="mt-2 text-sm text-gray-500">
              Category: {receipt.category || "—"}
            </div>

            <div className="mt-2 text-lg font-medium text-green-600">
              ₹{receipt.amount}
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Date: {new Date(receipt.date).toLocaleDateString()}
            </div>

            {receipt.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                {receipt.notes}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => nav(`/receipts/${receipt._id}/edit`)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={removeReceipt}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
