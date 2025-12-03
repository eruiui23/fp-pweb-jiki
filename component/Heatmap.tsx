"use client";

import React from 'react';
import { ActivityCalendar } from 'react-activity-calendar'; 
import { subDays } from 'date-fns';

interface HeatmapProps {
  data?: Array<{ date: string; count: number; level: number }>;
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  
  // Logic generate data dummy
  const generateMockData = () => {
    const data = [];
    const today = new Date();
    for (let i = 365; i >= 0; i--) {
      const date = subDays(today, i).toISOString().split('T')[0];
      const count = Math.floor(Math.random() * 10); 
      
      // Level menentukan seberapa gelap warnanya (0-4)
      const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4;
      
      data.push({ date, count, level });
    }
    return data;
  };

  const finalData = data || generateMockData();

  // 🎨 PALET WARNA BIRU
  // Level 0 (Kosong) -> Level 4 (Paling Gelap/Banyak)
  const theme = {
    light: [
      '#ebedf0', // Level 0: Abu-abu (Kosong)
      '#dbeafe', // Level 1: Biru Sangat Muda (Blue-100)
      '#60a5fa', // Level 2: Biru Muda (Blue-400)
      '#2563eb', // Level 3: Biru Sedang (Blue-600)
      '#1e40af', // Level 4: Biru Tua (Blue-800)
    ],
    dark: [
      '#161b22', // Level 0 (Dark mode)
      '#1e3a8a', // Level 1
      '#2563eb', // Level 2
      '#3b82f6', // Level 3
      '#60a5fa', // Level 4
    ],
  };

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white max-w-full overflow-x-auto">
      {/* <h3 className="text-lg font-semibold mb-4 text-gray-700">Productivity Streak</h3> */}
      
      <ActivityCalendar
        data={finalData}
        theme={theme} // <--- Ini yang mengubah warna jadi biru
        blockSize={12}
        blockMargin={4}
        fontSize={14}
        // Label kustom
        labels={{
            legend: {
                less: 'Sedikit',
                more: 'Banyak'
            },
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            totalCount: '{{count}} aktivitas di tahun lalu'
        }}
      />
    </div>
  );
};

export default Heatmap;