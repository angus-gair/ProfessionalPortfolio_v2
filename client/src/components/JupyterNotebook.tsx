import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type JupyterNotebookProps = {
  notebookId: string;
};

export default function JupyterNotebook({ notebookId }: JupyterNotebookProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading of a Jupyter notebook
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="bg-gray-100 rounded-md p-2 mb-2 flex items-center">
          <div className="flex space-x-1 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="bg-gray-100 rounded-md p-2 mb-2 flex items-center">
        <div className="flex space-x-1 mr-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-gray-600">customer_segmentation.ipynb</span>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="border-b border-gray-200 p-2 bg-gray-50">
          <span className="text-xs font-mono bg-blue-100 text-blue-800 py-1 px-2 rounded">In [1]:</span>
        </div>
        <div className="p-3 text-sm font-mono text-gray-800">
          <pre>import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Load the customer data
df = pd.read_csv('customer_data.csv')

# Display the first few rows
df.head()</pre>
        </div>
        <div className="border-t border-gray-200 p-2 bg-gray-50">
          <span className="text-xs font-mono bg-red-100 text-red-800 py-1 px-2 rounded">Out [1]:</span>
        </div>
        <div className="p-3">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-1 px-2 border">&nbsp;</th>
                  <th className="py-1 px-2 border">customer_id</th>
                  <th className="py-1 px-2 border">age</th>
                  <th className="py-1 px-2 border">income</th>
                  <th className="py-1 px-2 border">spending_score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 px-2 border">0</td>
                  <td className="py-1 px-2 border">1</td>
                  <td className="py-1 px-2 border">19</td>
                  <td className="py-1 px-2 border">15000</td>
                  <td className="py-1 px-2 border">39</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 border">1</td>
                  <td className="py-1 px-2 border">2</td>
                  <td className="py-1 px-2 border">21</td>
                  <td className="py-1 px-2 border">35000</td>
                  <td className="py-1 px-2 border">81</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 border">2</td>
                  <td className="py-1 px-2 border">3</td>
                  <td className="py-1 px-2 border">20</td>
                  <td className="py-1 px-2 border">27000</td>
                  <td className="py-1 px-2 border">6</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="border-b border-gray-200 p-2 bg-gray-50">
          <span className="text-xs font-mono bg-blue-100 text-blue-800 py-1 px-2 rounded">In [2]:</span>
        </div>
        <div className="p-3 text-sm font-mono text-gray-800">
          <pre>
# Prepare data for clustering
X = df[['age', 'income', 'spending_score']]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Find optimal number of clusters using the Elbow Method
wcss = []
for i in range(1, 11):
    kmeans = KMeans(n_clusters=i, init='k-means++', max_iter=300, n_init=10, random_state=42)
    kmeans.fit(X_scaled)
    wcss.append(kmeans.inertia_)

# Plot the Elbow Method
plt.figure(figsize=(10, 6))
plt.plot(range(1, 11), wcss, marker='o', linestyle='-')
plt.title('Elbow Method for Optimal Clusters')
plt.xlabel('Number of Clusters')
plt.ylabel('WCSS')
plt.show()</pre>
        </div>
        <div className="p-3 bg-white">
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            {/* Placeholder for elbow method plot image */}
            <div className="text-sm text-gray-500">Elbow Method Plot</div>
          </div>
        </div>
      </div>
    </div>
  );
}
