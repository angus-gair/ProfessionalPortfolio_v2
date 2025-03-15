import { motion } from "framer-motion";
import { experiences } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-12 text-[#2D3E50] text-center"
        >
          Work Experience
        </motion.h2>
        
        <div className="space-y-12">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-[#F5F7FA] rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#2D3E50]">{experience.title}</h3>
                  <p className="text-lg text-[#3498DB]">{experience.company}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-block bg-[#2D3E50] text-white py-1 px-3 rounded-full text-sm">
                    {experience.period}
                  </span>
                </div>
              </div>
              
              <p className="mb-6">{experience.description}</p>
              
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {experience.achievements.map((achievement, idx) => (
                  <li key={idx}>{achievement}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
