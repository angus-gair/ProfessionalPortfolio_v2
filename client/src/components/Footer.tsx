import { Link } from "wouter";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { section: "Navigation", items: [
      { name: "About", href: "/#about" },
      { name: "Skills", href: "/#skills" },
      { name: "Experience", href: "/#experience" },
      { name: "Projects", href: "/#projects" },
      { name: "Contact", href: "/#contact" },
    ]},
    { section: "Connect", items: [
      { name: "GitHub", href: profile.githubUrl },
      { name: "LinkedIn", href: profile.linkedinUrl },
      { name: "Twitter", href: profile.twitterUrl },
      { name: "Medium", href: profile.mediumUrl },
    ]},
  ];
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-0"
          >
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-400 mt-2">{profile.title}</p>
          </motion.div>
          
          <div className="flex flex-wrap gap-8">
            {footerLinks.map((linkGroup) => (
              <motion.div
                key={linkGroup.section}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold mb-3">{linkGroup.section}</h3>
                <ul className="space-y-2">
                  {linkGroup.items.map((link) => (
                    <li key={link.name}>
                      {link.href.startsWith('http') ? (
                        <a 
                          href={link.href} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400">© {currentYear} {profile.name}. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors mr-4">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
