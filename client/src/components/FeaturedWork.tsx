import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import JupyterNotebook from "./JupyterNotebook";
import TableauDashboard from "./TableauDashboard";

export default function FeaturedWork() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-12 text-[#2D3E50] text-center"
        >
          Featured Work
        </motion.h2>
        
        <div className="space-y-16">
          {/* Interactive Jupyter Notebook */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#F5F7FA] rounded-lg p-8 shadow-md"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-[#2D3E50] mb-4">Interactive Jupyter Notebooks</h3>
                <p className="text-lg mb-6">
                  Explore my data analysis and machine learning workflows through interactive Jupyter notebooks. 
                  These notebooks demonstrate my approach to problem-solving and showcase various techniques in action.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li>Step-by-step exploratory data analysis</li>
                  <li>Model training and evaluation processes</li>
                  <li>Visualizations and insights extraction</li>
                  <li>Code annotations and methodology explanations</li>
                </ul>
                <Button className="bg-[#3498DB] hover:bg-blue-600">
                  Explore Notebooks
                </Button>
              </div>
              <div className="lg:w-1/2 bg-white p-4 rounded-md shadow-sm">
                <JupyterNotebook notebookId="featured-notebook" />
              </div>
            </div>
          </motion.div>
          
          {/* Tableau Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#F5F7FA] rounded-lg p-8 shadow-md"
          >
            <div className="flex flex-col lg:flex-row-reverse gap-8">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-[#2D3E50] mb-4">Tableau Dashboards</h3>
                <p className="text-lg mb-6">
                  Interactive business intelligence dashboards built with Tableau that provide actionable insights 
                  from complex datasets. These dashboards combine powerful analytics with intuitive user interfaces.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li>Real-time data visualization and exploration</li>
                  <li>Interactive filtering and drill-down capabilities</li>
                  <li>Custom calculated fields and metrics</li>
                  <li>Embedded analytics for web applications</li>
                </ul>
                <Button className="bg-[#3498DB] hover:bg-blue-600">
                  Explore Dashboards
                </Button>
              </div>
              <div className="lg:w-1/2 bg-gray-800 rounded-md overflow-hidden shadow-md">
                <TableauDashboard dashboardId="featured-dashboard" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
