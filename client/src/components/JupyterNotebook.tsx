import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

type JupyterNotebookProps = {
  notebookId: string;
};

export default function JupyterNotebook({ notebookId }: JupyterNotebookProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading of a Jupyter notebook
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <Skeleton className="h-6 w-40 mb-6" />
        <Skeleton className="h-[600px] w-full rounded-md" />
      </div>
    );
  }
  
  // Christmas Budget Optimization Notebook
  if (notebookId === "xmas-budget") {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
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
          <span className="text-xs text-gray-600">xmas_budget_optimisation2.ipynb</span>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          {/* Title */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-2">Christmas Budget Optimization</h1>
            <p className="text-gray-600">
              Using linear programming to optimize gift allocation based on preferences and budget constraints.
            </p>
          </div>
      
          {/* Results section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Optimization Results</h2>
            <div className="p-4 bg-gray-50 rounded-md mb-4">
              <p className="font-mono text-sm mb-2">Status: Optimal</p>
              <p className="font-mono text-sm mb-2">Total Preference Score: 42.0</p>
              <p className="font-mono text-sm">Total Cost: $399.95</p>
            </div>
            
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full bg-white text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Recipient</th>
                    <th className="py-2 px-4 border">Gift</th>
                    <th className="py-2 px-4 border">Price ($)</th>
                    <th className="py-2 px-4 border">Preference Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border">Mom</td>
                    <td className="py-2 px-4 border">Coffee Machine</td>
                    <td className="py-2 px-4 border">89.99</td>
                    <td className="py-2 px-4 border">9</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">Dad</td>
                    <td className="py-2 px-4 border">Bluetooth Speaker</td>
                    <td className="py-2 px-4 border">59.99</td>
                    <td className="py-2 px-4 border">9</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">Sister</td>
                    <td className="py-2 px-4 border">Smart Watch</td>
                    <td className="py-2 px-4 border">199.99</td>
                    <td className="py-2 px-4 border">9</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">Brother</td>
                    <td className="py-2 px-4 border">Board Game</td>
                    <td className="py-2 px-4 border">29.99</td>
                    <td className="py-2 px-4 border">9</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">Grandma</td>
                    <td className="py-2 px-4 border">Book Set</td>
                    <td className="py-2 px-4 border">49.99</td>
                    <td className="py-2 px-4 border">9</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Visualization */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Budget Allocation</h2>
            <div className="bg-gray-50 p-6 rounded-md">
              <div className="text-center mb-4 font-semibold text-gray-700">Optimal Gift Allocation by Price</div>
              <div className="relative h-64">
                <div className="absolute bottom-0 w-full border-b-2 border-gray-300"></div>
                
                {/* Graph bars */}
                <div className="flex h-56 items-end justify-around">
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-center mb-1">Pref: 9</div>
                    <div className="w-16 bg-blue-400 rounded-t" style={{height: '45%'}}></div>
                    <div className="text-xs mt-2">Mom<br/>$89.99</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-center mb-1">Pref: 9</div>
                    <div className="w-16 bg-blue-400 rounded-t" style={{height: '30%'}}></div>
                    <div className="text-xs mt-2">Dad<br/>$59.99</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-center mb-1">Pref: 9</div>
                    <div className="w-16 bg-blue-400 rounded-t" style={{height: '100%'}}></div>
                    <div className="text-xs mt-2">Sister<br/>$199.99</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-center mb-1">Pref: 9</div>
                    <div className="w-16 bg-blue-400 rounded-t" style={{height: '15%'}}></div>
                    <div className="text-xs mt-2">Brother<br/>$29.99</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-center mb-1">Pref: 9</div>
                    <div className="w-16 bg-blue-400 rounded-t" style={{height: '25%'}}></div>
                    <div className="text-xs mt-2">Grandma<br/>$49.99</div>
                  </div>
                </div>
                
                {/* Equal budget line */}
                <div className="absolute bottom-[40%] left-0 w-full border-t-2 border-dashed border-red-400"></div>
                <div className="absolute bottom-[40%] right-0 text-xs text-red-500 pr-2">Equal Budget ($80.00)</div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 text-center">
                Each person receives their highest preference gift while staying within the total budget of $400.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default notebook (customer segmentation)
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
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
        <span className="text-xs text-gray-600">customer_segmentation.ipynb</span>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold mb-2">Customer Segmentation Analysis</h1>
          <p className="text-gray-600">
            Using K-means clustering to identify distinct customer segments based on demographics and purchasing behavior.
          </p>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Dataset Preview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">&nbsp;</th>
                  <th className="py-2 px-4 border">customer_id</th>
                  <th className="py-2 px-4 border">age</th>
                  <th className="py-2 px-4 border">income</th>
                  <th className="py-2 px-4 border">spending_score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border">0</td>
                  <td className="py-2 px-4 border">1</td>
                  <td className="py-2 px-4 border">19</td>
                  <td className="py-2 px-4 border">15000</td>
                  <td className="py-2 px-4 border">39</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border">1</td>
                  <td className="py-2 px-4 border">2</td>
                  <td className="py-2 px-4 border">21</td>
                  <td className="py-2 px-4 border">35000</td>
                  <td className="py-2 px-4 border">81</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border">2</td>
                  <td className="py-2 px-4 border">3</td>
                  <td className="py-2 px-4 border">20</td>
                  <td className="py-2 px-4 border">27000</td>
                  <td className="py-2 px-4 border">6</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border">3</td>
                  <td className="py-2 px-4 border">4</td>
                  <td className="py-2 px-4 border">23</td>
                  <td className="py-2 px-4 border">48000</td>
                  <td className="py-2 px-4 border">72</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border">4</td>
                  <td className="py-2 px-4 border">5</td>
                  <td className="py-2 px-4 border">31</td>
                  <td className="py-2 px-4 border">57000</td>
                  <td className="py-2 px-4 border">35</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Cluster Analysis</h2>
          <div className="bg-gray-50 p-6 rounded-md">
            <div className="text-center mb-6">
              <div className="font-semibold text-lg mb-2">Optimal Number of Clusters</div>
              <div className="text-gray-600 text-sm mb-4">Elbow Method Analysis</div>
              <div className="h-64 bg-white rounded-md shadow-sm flex items-center justify-center">
                <div className="w-full max-w-lg">
                  <svg viewBox="0 0 400 200" className="w-full">
                    <path d="M 50,150 L 80,120 L 110,80 L 140,60 L 170,50 L 200,42 L 230,38 L 260,35 L 290,33 L 320,32" 
                      fill="none" stroke="blue" strokeWidth="2" />
                    <circle cx="50" cy="150" r="4" fill="blue" />
                    <circle cx="80" cy="120" r="4" fill="blue" />
                    <circle cx="110" cy="80" r="4" fill="blue" />
                    <circle cx="140" cy="60" r="4" fill="blue" />
                    <circle cx="170" cy="50" r="4" fill="blue" />
                    <circle cx="200" cy="42" r="4" fill="blue" />
                    <circle cx="230" cy="38" r="4" fill="blue" />
                    <circle cx="260" cy="35" r="4" fill="blue" />
                    <circle cx="290" cy="33" r="4" fill="blue" />
                    <circle cx="320" cy="32" r="4" fill="blue" />
                    
                    <line x1="50" y1="160" x2="320" y2="160" stroke="black" strokeWidth="1" />
                    <line x1="50" y1="160" x2="50" y2="30" stroke="black" strokeWidth="1" />
                    
                    <text x="320" y="175" fontSize="10" textAnchor="end">Number of Clusters</text>
                    <text x="40" y="30" fontSize="10" textAnchor="end" transform="rotate(-90, 30, 100)">WCSS</text>
                    
                    <text x="50" y="175" fontSize="8" textAnchor="middle">1</text>
                    <text x="80" y="175" fontSize="8" textAnchor="middle">2</text>
                    <text x="110" y="175" fontSize="8" textAnchor="middle">3</text>
                    <text x="140" y="175" fontSize="8" textAnchor="middle">4</text>
                    <text x="170" y="175" fontSize="8" textAnchor="middle">5</text>
                    <text x="200" y="175" fontSize="8" textAnchor="middle">6</text>
                    <text x="230" y="175" fontSize="8" textAnchor="middle">7</text>
                    <text x="260" y="175" fontSize="8" textAnchor="middle">8</text>
                    <text x="290" y="175" fontSize="8" textAnchor="middle">9</text>
                    <text x="320" y="175" fontSize="8" textAnchor="middle">10</text>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Based on the Elbow Method analysis, 5 clusters provide the optimal segmentation for this customer dataset.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}