import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/data";
import { Github, ExternalLink, Book, BarChart3 } from "lucide-react";

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-[#F5F7FA]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-[#2D3E50]">Featured Projects</h2>
          <p className="text-lg mb-12 max-w-3xl mx-auto">
            A selection of my most significant work, showcasing my skills in data science, 
            visualization, and full-stack development.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-48 bg-gray-200 relative">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`bg-${project.categoryColor} text-white text-xs py-1 px-2 rounded-md`}>
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2D3E50] mb-2">{project.title}</h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <Link href={`/project/${project.id}`}>
                    <a className="text-[#3498DB] hover:underline font-medium">View Details</a>
                  </Link>
                  <div className="flex gap-2">
                    {project.hasJupyterNotebook && (
                      <Link href={`/notebook/${project.id}`}>
                        <a
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          aria-label="Jupyter Notebook"
                          title="View Jupyter Notebook"
                        >
                          <Book className="h-5 w-5" />
                        </a>
                      </Link>
                    )}
                    {project.hasTableauDashboard && (
                      <Link href={`/dashboard/${project.id}`}>
                        <a
                          className="text-green-500 hover:text-green-700 transition-colors"
                          aria-label="Tableau Dashboard" 
                          title="View Tableau Dashboard"
                        >
                          <BarChart3 className="h-5 w-5" />
                        </a>
                      </Link>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="GitHub Repository"
                        title="GitHub Repository"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Live Demo"
                        title="Live Demo"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Button asChild className="gap-2 bg-[#2D3E50] hover:bg-[#2D3E50]/90">
            <a href="https://github.com/angus-gair" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              <span>View More Projects on GitHub</span>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
