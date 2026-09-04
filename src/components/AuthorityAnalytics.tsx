import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

interface CrimeStat {
  month: string;
  theft: number;
  harassment: number;
  disputes: number;
  emergencies: number;
}

export const AuthorityAnalytics: React.FC = () => {
  const [data, setData] = useState<CrimeStat[]>([]);

  useEffect(() => {
    Papa.parse('/crime_stats.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setData(results.data as CrimeStat[]);
      }
    });
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161B22] p-4 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Activity className="w-5 h-5" />
            <h3 className="font-semibold">Total Cases (YTD)</h3>
          </div>
          <p className="text-3xl font-bold text-slate-200">
            {data.reduce((acc, curr) => acc + (curr.theft || 0) + (curr.harassment || 0) + (curr.disputes || 0) + (curr.emergencies || 0), 0)}
          </p>
        </div>
        <div className="bg-[#161B22] p-4 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-semibold">Highest Crime Type</h3>
          </div>
          <p className="text-3xl font-bold text-slate-200">Theft</p>
        </div>
        <div className="bg-[#161B22] p-4 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 text-green-400 mb-2">
            <BarChart3 className="w-5 h-5" />
            <h3 className="font-semibold">Avg Cases / Month</h3>
          </div>
          <p className="text-3xl font-bold text-slate-200">
            {Math.round(data.reduce((acc, curr) => acc + (curr.theft || 0) + (curr.harassment || 0) + (curr.disputes || 0) + (curr.emergencies || 0), 0) / data.length)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-[#0D1117] p-6 rounded-xl border border-gray-800 shadow-xl">
          <h3 className="text-lg font-bold text-slate-200 mb-4 border-b border-gray-800 pb-2">
            Monthly Crime Trends (CSV Data)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
                />
                <Legend />
                <Line type="monotone" dataKey="theft" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="harassment" stroke="#a855f7" strokeWidth={2} />
                <Line type="monotone" dataKey="disputes" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-[#0D1117] p-6 rounded-xl border border-gray-800 shadow-xl">
          <h3 className="text-lg font-bold text-slate-200 mb-4 border-b border-gray-800 pb-2">
            Incident Breakdown by Category
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
                  cursor={{ fill: '#374151' }}
                />
                <Legend />
                <Bar dataKey="theft" stackId="a" fill="#ef4444" />
                <Bar dataKey="harassment" stackId="a" fill="#a855f7" />
                <Bar dataKey="disputes" stackId="a" fill="#3b82f6" />
                <Bar dataKey="emergencies" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
