import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, FileText } from "lucide-react";
import { profile } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:w-2/5"
          >
            <img 
              src={profile.imageUrl} 
              alt={profile.name} 
              className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[4/5]" 
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-3/5"
          >
            <h2 className="text-3xl font-bold mb-6 text-[#2D3E50]">About Me</h2>
            <p className="text-lg mb-6">{profile.about}</p>
            <p className="text-lg mb-6">{profile.approach}</p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Button asChild variant="outline" className="gap-2">
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" /> Resume
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
