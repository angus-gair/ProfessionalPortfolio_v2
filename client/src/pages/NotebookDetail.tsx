import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { projects } from "@/lib/data";
import JupyterNotebook from "@/components/JupyterNotebook";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotebookDetail() {
  const [, params] = useRoute('/notebook/:id');
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params && params.id) {
      const foundProject = projects.find(p => p.id === params.id);
      setProject(foundProject);
      setLoading(false);
    }
  }, [params]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Notebook not found</h1>
        <p className="mb-6">The notebook you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{project.title}</h1>
        <p className="text-gray-600 mb-4">{project.fullDescription}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech: string) => (
            <span key={tech} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Interactive Jupyter Notebook</h2>
          <p className="text-sm text-gray-600">Explore the data analysis and code execution</p>
        </div>
        
        <div className="p-6">
          {project.hasJupyterNotebook && (
            <JupyterNotebook notebookId={project.jupyterNotebookId} />
          )}
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button asChild variant="outline">
          <Link href="/">Back to All Projects</Link>
        </Button>
        
        {project.githubUrl && (
          <Button asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              View Code on GitHub
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}