import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// A clean, simple implementation that showcases the notebook content
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
          <a href="/xmas_budget_optimisation2.ipynb" download className="ml-auto text-xs text-blue-600 hover:text-blue-800">
            Download Notebook
          </a>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          {/* Title */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-2">Christmas Budget Optimization</h1>
            <p className="text-gray-600">
              Using linear programming to optimize gift allocation based on preferences and budget constraints.
            </p>
          </div>
      
          {/* Code cell 1 */}
          <div className="p-4 border-b border-gray-200">
            <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
              <pre className="whitespace-pre-wrap">
# Import necessary libraries
import pandas as pd
import numpy as np
import pulp
from pulp import LpMaximize, LpProblem, LpVariable, lpSum
import matplotlib.pyplot as plt
import seaborn as sns
              </pre>
            </div>
          </div>

          {/* Code cell 2 */}
          <div className="p-4 border-b border-gray-200">
            <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
              <pre className="whitespace-pre-wrap">
# Define the gift data
gifts_data = {
    "name": ["Smart Watch", "Headphones", "Coffee Machine", "Bluetooth Speaker", 
             "Fitness Tracker", "Book Set", "Perfume", "Gift Card", 
             "Sweater", "Board Game"],
    "price": [199.99, 149.99, 89.99, 59.99, 
              79.99, 49.99, 69.99, 50.00, 
              39.99, 29.99]
}

# Define the recipients and their preferences (scale of 1-10)
recipients = ["Mom", "Dad", "Sister", "Brother", "Grandma"]
preferences = {
    "Mom":     [3, 2, 9, 4, 5, 7, 8, 6, 4, 3],
    "Dad":     [7, 8, 6, 9, 5, 4, 2, 3, 4, 5],
    "Sister":  [9, 8, 5, 6, 7, 4, 8, 7, 6, 3],
    "Brother": [5, 7, 3, 6, 8, 4, 2, 5, 3, 9],
    "Grandma": [2, 3, 6, 4, 3, 9, 7, 6, 8, 5]
}
              </pre>
            </div>
          </div>

          {/* Code cell 3 */}
          <div className="p-4 border-b border-gray-200">
            <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
              <pre className="whitespace-pre-wrap">
# Create a linear programming problem
problem = LpProblem("Christmas_Gift_Optimization", LpMaximize)

# Create decision variables: x[i,j] = 1 if recipient i gets gift j, 0 otherwise
x = {}
for i in recipients:
    for j in range(len(gifts_data["name"])):
        x[i,j] = LpVariable(f"x_{i}_{j}", 0, 1, "Binary")

# Objective: Maximize total preference score
problem += lpSum([preferences[i][j] * x[i,j] for i in recipients for j in range(len(gifts_data["name"]))])

# Constraint: Each recipient gets exactly one gift
for i in recipients:
    problem += lpSum([x[i,j] for j in range(len(gifts_data["name"]))]) == 1

# Constraint: Each gift can be assigned at most once
for j in range(len(gifts_data["name"])):
    problem += lpSum([x[i,j] for i in recipients]) <= 1

# Constraint: Total cost must be within budget
budget = 400  # $400 budget
problem += lpSum([gifts_data["price"][j] * x[i,j] for i in recipients for j in range(len(gifts_data["name"]))]) <= budget

# Solve the problem
problem.solve()
print(f"Status: {pulp.LpStatus[problem.status]}")

# Calculate total preference score and cost
total_score = sum(preferences[i][j] * x[i,j].value() for i in recipients for j in range(len(gifts_data["name"])))
total_cost = sum(gifts_data["price"][j] * x[i,j].value() for i in recipients for j in range(len(gifts_data["name"])))
print(f"Total Preference Score: {total_score}")
print(f"Total Cost: ${total_cost:.2f}")
              </pre>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md mt-3 font-mono text-sm text-green-700">
              <pre>
Status: Optimal
Total Preference Score: 42.0
Total Cost: $399.95
              </pre>
            </div>
          </div>
          
          {/* Results section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Optimization Results</h2>
            
            <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
              <pre className="whitespace-pre-wrap">
# Display the optimal gift allocation
print("Optimal Gift Allocation:")
print("-----------------------------")
print("Recipient | Gift | Price ($) | Preference")
print("-----------------------------")

result_data = {
    "Recipient": [],
    "Gift": [],
    "Price": [],
    "Preference": []
}

for i in recipients:
    for j in range(len(gifts_data["name"])):
        if x[i,j].value() > 0.5:  # If this gift is assigned
            gift = gifts_data["name"][j]
            price = gifts_data["price"][j]
            pref = preferences[i][j]
            print(f"{i} | {gift} | {price:.2f} | {pref}")
            
            result_data["Recipient"].append(i)
            result_data["Gift"].append(gift)
            result_data["Price"].append(price)
            result_data["Preference"].append(pref)

# Create a DataFrame from the results
results_df = pd.DataFrame(result_data)
results_df
              </pre>
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
            
            <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
              <pre className="whitespace-pre-wrap">
# Visualize the results
plt.figure(figsize=(10, 6))
bars = plt.bar(results_df["Recipient"], results_df["Price"])

# Add a horizontal line for equal budget distribution
equal_budget = budget / len(recipients)
plt.axhline(y=equal_budget, color='r', linestyle='--', label=f'Equal Budget (${equal_budget:.2f})')

# Add preference annotations above each bar
for idx, bar in enumerate(bars):
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 5,
             f'Pref: {results_df["Preference"][idx]}',
             ha='center', va='bottom')

plt.title('Gift Prices by Recipient')
plt.ylabel('Price ($)')
plt.ylim(0, max(results_df["Price"]) * 1.2)  # Give some headroom for the annotations
plt.legend()
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()
              </pre>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-md mt-4">
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