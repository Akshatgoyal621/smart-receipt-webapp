import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { useNotify } from "../components/NotificationBus";

// Types
interface FormState {
  title: string;
  amount: number | "";
  category: string;
  date: string;
  notes: string;
  file: File | null;
}

interface Receipt {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  imageUrl?: string;
}

export default function ReceiptForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchedRef = useRef(false);
  const nav = useNavigate();
  const notify = useNotify();

  // Load existing data (Edit mode)
  const fetchExisting = useCallback(async () => {
    if (!isEdit || !id) {
      setInitialLoading(false);
      return;
    }

    try {
      const { data } = await API.get<Receipt>(`/receipts/${id}`);

      setForm({
        title: data.title,
        amount: data.amount,
        category: data.category,
        date: data.date?.split("T")[0] || "",
        notes: data.notes || "",
        file: null,
      });
    } catch (err) {
      notify({
        title: "Failed to Load Receipt",
        message: "Unable to load the receipt. Redirecting...",
      });

      setTimeout(() => nav("/receipts"), 10);
    } finally {
      setInitialLoading(false);
    }
  }, [id, isEdit, nav, notify]);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchExisting();
    }
  }, [fetchExisting]);

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) || "" : value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      file: e.target.files?.[0] ?? null,
    }));
  };

  // Submit
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.amount) {
      notify({
        title: "Missing Details",
        message: "Please provide both title and amount.",
      });
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("amount", String(form.amount));
    fd.append("category", form.category);
    fd.append("date", form.date);
    fd.append("notes", form.notes);
    if (form.file) fd.append("image", form.file);

    try {
      if (isEdit) {
        await API.put(`/receipts/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        notify({
          title: "Receipt Updated",
          message: "Your receipt has been successfully updated.",
        });

        setTimeout(() => nav(`/receipts/${id}`), 10);
      } else {
        await API.post("/receipts", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        notify({
          title: "Receipt Added",
          message: "Your new receipt was created successfully.",
        });

        setTimeout(() => nav("/receipts"), 10);
      }
    } catch (err) {
      notify({
        title: isEdit ? "Update Failed" : "Creation Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // UI
   if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-50">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

        {/* Text */}
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Preparing your Receipt Form
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h3 className="text-lg font-medium mb-3">
          {isEdit ? "Edit receipt" : "Upload new receipt"}
        </h3>

        <form onSubmit={submit} className="space-y-3">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Title"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
              placeholder="Amount"
            />

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
              placeholder="Category"
            />
          </div>

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <textarea
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Notes"
          />

          <label className="inline-block px-3 py-2 bg-gray-100 border rounded-lg cursor-pointer text-sm">
            {form.file ? form.file.name : "Choose image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-500 text-white px-4 py-2 rounded-lg"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Uploading..."
                : isEdit
                ? "Update receipt"
                : "Upload receipt"}
            </button>

            <button
              type="button"
              onClick={() =>
                isEdit && id ? nav(`/receipts/${id}`) : nav("/receipts")
              }
              className="px-3 py-2 border rounded-lg"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
