import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import JupyterNotebook from "@/components/JupyterNotebook";
import TableauDashboard from "@/components/TableauDashboard";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  
  const project = projects.find(p => p.id === id);
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Project Not Found</h1>
            <p className="mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation('/#projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="bg-background pt-24 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => setLocation('/#projects')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md mb-10">
            <div className="h-64 sm:h-96 bg-gray-200 relative">
              {/* Project image would be here */}
              <div className="absolute top-4 right-4">
                <span className={`bg-${project.categoryColor} text-white text-xs py-1 px-3 rounded-full`}>
                  {project.category}
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl font-bold text-primary mb-4">{project.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-xs py-1 px-3 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="prose max-w-none mb-8">
                <p className="text-lg mb-4">{project.description}</p>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">Project Overview</h2>
                <p>{project.fullDescription}</p>
                
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">Methodology</h2>
                <p>{project.methodology}</p>
                
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">Results</h2>
                <p>{project.results}</p>
              </div>
              
              {project.hasJupyterNotebook && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold text-primary mb-6">Interactive Notebook</h2>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <JupyterNotebook notebookId={project.jupyterNotebookId} />
                  </div>
                </div>
              )}
              
              {project.hasTableauDashboard && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold text-primary mb-6">Interactive Dashboard</h2>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <TableauDashboard dashboardId={project.tableauDashboardId} />
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 mt-10">
                {project.githubUrl && (
                  <Button asChild variant="outline" className="gap-2">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" /> View on GitHub
                    </a>
                  </Button>
                )}
                
                {project.liveUrl && (
                  <Button asChild className="gap-2">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
