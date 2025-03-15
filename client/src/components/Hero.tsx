import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { profile } from "@/lib/data";

export default function Hero() {
  return (
    <section id="hero" className="py-20 md:py-32 bg-primary text-white relative overflow-hidden">
      <div className="container mx-auto px-6 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:w-2/3"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {profile.name}
          </h1>
          <h2 className="text-2xl md:text-3xl text-[#3498DB] font-medium mb-6">
            {profile.title}
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            {profile.summary}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-[#3498DB] hover:bg-blue-600">
              <a href="#projects">View My Work</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <a href="#contact">
                Get In Touch <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute right-0 bottom-0 opacity-10 w-1/2 h-full">
        <div className="w-full h-full bg-cover bg-center"></div>
      </div>
    </section>
  );
}
