import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints prefix
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the contact form data
      const validatedData = contactFormSchema.parse(req.body);
      
      // Here you would typically send an email or store the contact submission
      // For this example, we'll just return a success response
      
      res.status(200).json({
        message: "Contact form submitted successfully",
        data: validatedData,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid form data",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          message: "An error occurred while processing your request",
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
