import React, { useEffect, useRef, useState, useCallback } from "react";
import API from "../api/axios";

import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

// Types
interface MonthlySummary {
  _id: { month: number; year: number };
  total: number;
}

interface Receipt {
  amount: number;
}

interface SummaryStats {
  total: number;
  count: number;
}

interface ChartPayload {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<SummaryStats>({ total: 0, count: 0 });
  const [chartData, setChartData] = useState<ChartPayload | null>(null);
  const [loading, setLoading] = useState(true);

  // Prevent double-fetch in Strict Mode
  const fetchedRef = useRef(false);

  // Fetch Dashboard Data
  const fetchDashboard = useCallback(async () => {
    try {
      // Monthly summary
      const { data } = await API.get("/receipts/summary/monthly");
      const arr: MonthlySummary[] = data.data ?? [];

      const labels = arr.map(
        (d) => `${d._id.month}/${d._id.year}`
      );

      const totals = arr.map((d) => d.total);

      setChartData({
        labels,
        datasets: [
          {
            label: "Monthly total",
            data: totals,
            backgroundColor: "rgba(37, 99, 235, 0.8)",
          },
        ],
      });

      // Total stats
      const resp = await API.get("/receipts");
      const receipts: Receipt[] = resp.data.receipts ?? [];

      const totalAmount = receipts.reduce(
        (sum, r) => sum + Number(r.amount),
        0
      );

      setStats({
        total: totalAmount,
        count: resp.data.total ?? receipts.length,
      });
    } catch (err) {
      console.warn("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Strict Mode–Safe Effect
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchDashboard();
    }
  }, [fetchDashboard]);

  // Render
 if (loading) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-50">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

      {/* Text */}
      <div className="text-lg font-medium text-gray-600 animate-pulse">
        Preparing your dashboard…
      </div>
    </div>
  );
}

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-gray-500">Total expenses</div>
          <div className="text-2xl font-semibold">₹{stats.total}</div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-500">Receipts</div>
          <div className="text-2xl font-semibold">{stats.count}</div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-500">Quick action</div>
          <div className="mt-2">
            <a
              href="/receipts/new"
              className="inline-block px-3 py-2 bg-brand-500 text-white rounded-lg"
            >
              Upload receipt
            </a>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Monthly expenses</h3>

        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
                title: { display: false },
              },
            }}
          />
        ) : (
          <div className="text-gray-500">No data available</div>
        )}
      </div>
    </div>
  );
}
