import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type TableauDashboardProps = {
  dashboardId: string;
};

export default function TableauDashboard({ dashboardId }: TableauDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading of a Tableau dashboard
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-800">
        <Skeleton className="h-8 w-full bg-gray-700" />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full bg-gray-700" />
          <Skeleton className="h-24 w-full bg-gray-700" />
        </div>
        <Skeleton className="h-40 w-full mt-4 bg-gray-700" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="bg-gray-700 p-3 text-white text-sm flex justify-between items-center">
        <span>Sales Performance Dashboard</span>
        <div className="flex space-x-2">
          <button className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded">Export</button>
          <button className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded">Filter</button>
        </div>
      </div>
      <div className="p-4 bg-gray-800">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-sm p-3">
            <h4 className="text-xs font-bold mb-2 text-gray-600">Total Revenue</h4>
            <p className="text-2xl font-bold text-[#2D3E50]">$1.25M</p>
            <div className="text-xs text-green-600 mt-1">↑ 12.3% vs Last Year</div>
          </div>
          <div className="bg-white rounded-sm p-3">
            <h4 className="text-xs font-bold mb-2 text-gray-600">Sales by Region</h4>
            <div className="h-20 flex items-end space-x-1">
              <div className="h-full w-1/4 flex flex-col justify-end">
                <div className="bg-blue-500 w-full" style={{ height: '60%' }}></div>
                <span className="text-xs mt-1">East</span>
              </div>
              <div className="h-full w-1/4 flex flex-col justify-end">
                <div className="bg-green-500 w-full" style={{ height: '80%' }}></div>
                <span className="text-xs mt-1">West</span>
              </div>
              <div className="h-full w-1/4 flex flex-col justify-end">
                <div className="bg-yellow-500 w-full" style={{ height: '45%' }}></div>
                <span className="text-xs mt-1">North</span>
              </div>
              <div className="h-full w-1/4 flex flex-col justify-end">
                <div className="bg-red-500 w-full" style={{ height: '70%' }}></div>
                <span className="text-xs mt-1">South</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-sm p-3">
          <h4 className="text-xs font-bold mb-2 text-gray-600">Monthly Trend</h4>
          <div className="h-24 flex items-end">
            <div className="w-full flex items-end space-x-1">
              {/* Chart bars */}
              <div className="bg-[#3498DB] h-12 w-1/12"></div>
              <div className="bg-[#3498DB] h-14 w-1/12"></div>
              <div className="bg-[#3498DB] h-10 w-1/12"></div>
              <div className="bg-[#3498DB] h-16 w-1/12"></div>
              <div className="bg-[#3498DB] h-20 w-1/12"></div>
              <div className="bg-[#3498DB] h-18 w-1/12"></div>
              <div className="bg-[#3498DB] h-14 w-1/12"></div>
              <div className="bg-[#3498DB] h-16 w-1/12"></div>
              <div className="bg-[#3498DB] h-22 w-1/12"></div>
              <div className="bg-[#3498DB] h-18 w-1/12"></div>
              <div className="bg-[#3498DB] h-20 w-1/12"></div>
              <div className="bg-[#E74C3C] h-24 w-1/12"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>
      </div>
    </div>
  );
}
