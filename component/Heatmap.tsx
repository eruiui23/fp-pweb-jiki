"use client";

import React, { useMemo } from 'react';
import { ActivityCalendar } from 'react-activity-calendar'; 
import { addDays, format, parseISO, isSameDay, differenceInCalendarDays } from 'date-fns';

interface TrackerData {
  createdAt: string;
  duration: number;
}

interface HeatmapProps {
  trackers?: TrackerData[];
}

const Heatmap: React.FC<HeatmapProps> = ({ trackers = [] }) => {
  
  const calendarData = useMemo(() => {
    const data = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    
    const startDate = new Date(currentYear, 0, 1); 
    const endDate = new Date(currentYear, 11, 31); 

    const daysInYear = differenceInCalendarDays(endDate, startDate) + 1;

    for (let i = 0; i < daysInYear; i++) {
      const currentDate = addDays(startDate, i);
      const dateString = format(currentDate, 'yyyy-MM-dd');

      const dailyTrackers = trackers.filter((t) => 
        isSameDay(parseISO(t.createdAt), currentDate)
      );

      const totalSeconds = dailyTrackers.reduce((acc, curr) => acc + curr.duration, 0);
      const totalMinutes = Math.floor(totalSeconds / 60);

      let level = 0;
      if (totalMinutes === 0) level = 0;
      else if (totalMinutes <= 30) level = 1;
      else if (totalMinutes <= 60) level = 2;
      else if (totalMinutes <= 120) level = 3;
      else level = 4;

      data.push({
        date: dateString,
        count: totalMinutes,
        level: level
      });
    }
    return data;
  }, [trackers]);

  const theme = {
    light: ['#ebedf0', '#dbeafe', '#60a5fa', '#2563eb', '#1e40af'],
    dark: ['#161b22', '#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa'],
  };

  return (
    <div className="w-full flex justify-center overflow-x-auto">
      <ActivityCalendar
        data={calendarData}
        theme={theme}
        blockSize={10}
        blockMargin={4}
        fontSize={14}
      />

      
    </div>
  );
};

export default Heatmap;