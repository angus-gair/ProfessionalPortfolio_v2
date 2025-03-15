import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import FeaturedWork from "@/components/FeaturedWork";
import Contact from "@/components/Contact";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

export default function Home() {
  return (
    <main>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <FeaturedWork />
        <Contact />
      </motion.div>
    </main>
  );
}
