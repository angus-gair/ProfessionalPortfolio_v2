import React, { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

type TableauDashboardProps = {
  dashboardId: string;
};

export default function TableauDashboard({ dashboardId }: TableauDashboardProps) {
  const vizRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This is a placeholder for actual Tableau integration
    // In a production environment, you would use the Tableau JavaScript API to load dashboards
    
    // Clean up function
    return () => {
      // Cleanup code here would dispose of Tableau objects when unmounting
    };
  }, [dashboardId]);

  // Handle different dashboards based on the ID
  if (dashboardId === 'rewards-performance') {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <Link href="/projects" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      
        <div className="bg-gray-100 rounded-md p-2 mb-2 flex items-center">
          <div className="flex space-x-1 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-600">BIGW_Rewards_MonthlySummary_PerformanceMetrics.twb</span>
        </div>
        
        <div ref={vizRef} className="border rounded-md shadow-sm bg-white p-4">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">BIG W Rewards Program</h1>
              <p className="text-gray-500">Monthly Performance Metrics</p>
            </div>
            
            {/* This would be replaced with actual Tableau dashboard in production */}
            <div className="bg-gray-50 h-[600px] rounded-md flex flex-col items-center justify-center p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="18" rx="2" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="16" x2="16" y2="16" />
                  <line x1="8" y1="8" x2="10" y2="8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tableau Dashboard Preview</h3>
              <p className="text-gray-500 max-w-md mb-6">
                In the actual implementation, this area would display an interactive Tableau dashboard 
                with customer rewards program metrics and KPIs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="bg-white p-4 rounded-md shadow border border-gray-100">
                  <div className="text-blue-500 font-bold text-2xl mb-1">12.4%</div>
                  <div className="text-sm text-gray-500">Enrollment Growth</div>
                </div>
                <div className="bg-white p-4 rounded-md shadow border border-gray-100">
                  <div className="text-green-500 font-bold text-2xl mb-1">$42.18</div>
                  <div className="text-sm text-gray-500">Avg. Basket Size</div>
                </div>
                <div className="bg-white p-4 rounded-md shadow border border-gray-100">
                  <div className="text-purple-500 font-bold text-2xl mb-1">3.2x</div>
                  <div className="text-sm text-gray-500">Redemption Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (dashboardId === 'mmm-model') {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <Link href="/projects" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      
        <div className="bg-gray-100 rounded-md p-2 mb-2 flex items-center">
          <div className="flex space-x-1 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-600">media_mix_modeling_dashboard.twb</span>
        </div>
        
        <div ref={vizRef} className="border rounded-md shadow-sm bg-white p-4">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">Media Mix Modeling</h1>
              <p className="text-gray-500">Marketing Channel Attribution & ROI Analysis</p>
            </div>
            
            {/* This would be replaced with actual Tableau dashboard in production */}
            <div className="bg-gray-50 h-[600px] rounded-md flex flex-col items-center justify-center p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">MMM Dashboard Preview</h3>
              <p className="text-gray-500 max-w-md mb-6">
                In the actual implementation, this area would display an interactive Tableau dashboard 
                showing media attribution modeling and ROI breakdown across channels.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl">
                <div className="bg-white p-3 rounded-md shadow border border-gray-100">
                  <div className="text-orange-500 font-bold text-xl mb-1">21%</div>
                  <div className="text-xs text-gray-500">Social Media</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow border border-gray-100">
                  <div className="text-blue-500 font-bold text-xl mb-1">34%</div>
                  <div className="text-xs text-gray-500">Paid Search</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow border border-gray-100">
                  <div className="text-green-500 font-bold text-xl mb-1">18%</div>
                  <div className="text-xs text-gray-500">Email</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow border border-gray-100">
                  <div className="text-purple-500 font-bold text-xl mb-1">27%</div>
                  <div className="text-xs text-gray-500">TV & Radio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default placeholder
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <Link href="/projects" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>
      
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Dashboard Not Found</h2>
          <p className="text-gray-500">
            The dashboard with ID "{dashboardId}" was not found or is not available.
          </p>
        </div>
      </div>
    </div>
  );
}