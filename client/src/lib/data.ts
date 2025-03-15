import {
  FileCode as Python,
  Database,
  Brain,
  GitBranch,
  BarChart,
  Server,
  Code,
  Terminal,
  Laptop
} from "lucide-react";

export const profile = {
  name: "Angus Gair",
  title: "Data Scientist & Full Stack Developer",
  summary: "Passionate about transforming complex data into actionable insights and building impactful applications. Expertise in machine learning, data visualization, and full-stack development.",
  about: "I'm a data scientist and full-stack developer with a passion for solving complex problems through code and analytics. With a background in statistics and computer science, I specialize in developing data-driven applications that deliver real business value.",
  approach: "My approach combines rigorous analytical thinking with creative problem-solving to build solutions that are both technically sound and user-friendly. I'm particularly interested in machine learning applications, interactive data visualization, and creating intuitive user experiences.",
  imageUrl: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  githubUrl: "https://github.com/angus-gair",
  linkedinUrl: "https://linkedin.com/in/angus-gair",
  twitterUrl: "https://twitter.com/angus_gair",
  mediumUrl: "https://medium.com/@angus.gair",
  resumeUrl: "#",
  email: "angus.gair@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA"
};

export const technicalSkills = [
  { name: "Python", level: 95 },
  { name: "Data Analysis & Visualization", level: 90 },
  { name: "Machine Learning", level: 85 },
  { name: "SQL & Database Management", level: 80 },
  { name: "Web Development", level: 75 }
];

export const tools = [
  { name: "Python", icon: Python },
  { name: "SQL", icon: Database },
  { name: "TensorFlow", icon: Brain },
  { name: "Git", icon: GitBranch },
  { name: "Tableau", icon: BarChart },
  { name: "React", icon: Code },
  { name: "AWS", icon: Server },
  { name: "Jupyter", icon: Laptop },
  { name: "Docker", icon: Terminal }
];

export const experiences = [
  {
    title: "Senior Data Scientist",
    company: "TechCorp Inc.",
    period: "Jan 2020 - Present",
    description: "Leading data science initiatives to develop predictive models and analytics solutions for enterprise clients. Responsible for the full machine learning pipeline from data collection to model deployment.",
    achievements: [
      "Developed and deployed a customer churn prediction model that increased retention by 15%",
      "Created interactive dashboards using Tableau to visualize KPIs and business metrics",
      "Mentored junior data scientists and collaborated with cross-functional teams",
      "Implemented automated data pipelines that reduced processing time by 40%"
    ]
  },
  {
    title: "Data Analyst",
    company: "Analytics Solutions Ltd.",
    period: "Mar 2017 - Dec 2019",
    description: "Analyzed large datasets to extract insights and support data-driven decision making across the organization. Worked closely with business stakeholders to understand requirements and deliver actionable analytics.",
    achievements: [
      "Built and maintained SQL databases for efficient data storage and retrieval",
      "Created comprehensive reports and presentations for executive leadership",
      "Implemented A/B testing frameworks to optimize marketing campaigns",
      "Collaborated with IT team to improve data collection and quality processes"
    ]
  },
  {
    title: "Junior Software Developer",
    company: "WebTech Solutions",
    period: "Jun 2015 - Feb 2017",
    description: "Developed and maintained web applications using modern front-end and back-end technologies. Participated in the full software development lifecycle from requirements gathering to deployment.",
    achievements: [
      "Built responsive user interfaces using HTML, CSS, and JavaScript",
      "Developed RESTful APIs using Python and Flask",
      "Participated in code reviews and implemented best practices",
      "Assisted in migrating legacy applications to modern frameworks"
    ]
  }
];

export const projects = [
  {
    id: "xmas-budget-optimization",
    title: "Christmas Budget Optimization",
    description: "An interactive notebook for optimizing holiday gift spending using linear programming and budget constraints.",
    fullDescription: "The Christmas Budget Optimization project helps users maximize gift value while staying within budget constraints. Using linear programming techniques, this project creates an optimal gift allocation strategy based on recipient preferences, gift costs, and available budget.",
    methodology: "The solution employs Python's PuLP library to formulate and solve the linear programming problem. The notebook guides users through the process of defining constraints, setting up the optimization model, and visualizing the results with matplotlib. It also includes a sensitivity analysis section to explore how changes in budget affect optimal gift selection.",
    results: "The optimization model successfully allocates funds across different gift categories while maximizing overall recipient satisfaction. Users can adjust parameters to reflect their own personal budget constraints and recipient preferences. The visualizations help users understand trade-offs between different allocation strategies.",
    imageUrl: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Data Science",
    categoryColor: "accent",
    technologies: ["Python", "PuLP", "Linear Programming"],
    githubUrl: "https://github.com/angus-gair/xmas-budget-optimization",
    liveUrl: "#",
    hasJupyterNotebook: true,
    jupyterNotebookId: "xmas-budget",
    hasTableauDashboard: false
  },
  {
    id: "customer-segmentation",
    title: "Customer Segmentation Dashboard",
    description: "An interactive dashboard for customer segmentation analysis using K-means clustering and visualization techniques.",
    fullDescription: "This project involves analyzing customer data to identify distinct customer segments based on their behavior, preferences, and demographics. By applying K-means clustering algorithms to the data, we were able to identify 5 distinct customer groups with unique characteristics.",
    methodology: "The project utilized Python for data preprocessing and scikit-learn for implementing the K-means clustering algorithm. The data was first cleaned and standardized, then principal component analysis was applied to reduce dimensionality while preserving information. The optimal number of clusters was determined using the elbow method and silhouette scores.",
    results: "The segmentation analysis successfully identified 5 distinct customer groups, each with unique behaviors and preferences. These insights were used to develop targeted marketing campaigns, resulting in a 25% increase in engagement and a 15% increase in conversion rates for targeted segments. The interactive dashboard enables business users to explore the segments and make data-driven decisions.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Data Science",
    categoryColor: "secondary",
    technologies: ["Python", "Scikit-learn", "Tableau"],
    githubUrl: "https://github.com/angus-gair/customer-segmentation",
    liveUrl: "#",
    hasJupyterNotebook: true,
    jupyterNotebookId: "customer-segmentation-notebook",
    hasTableauDashboard: true,
    tableauDashboardId: "customer-segmentation-dashboard"
  },
  {
    id: "predictive-maintenance",
    title: "Predictive Maintenance System",
    description: "A machine learning system that predicts equipment failures before they occur, reducing downtime and maintenance costs.",
    fullDescription: "This project implements a machine learning system that monitors equipment sensor data to predict potential failures before they occur. By detecting early warning signs of equipment degradation, maintenance can be scheduled proactively, minimizing costly downtime and extending asset lifespan.",
    methodology: "The solution utilizes time-series data from equipment sensors, which is processed using a combination of statistical analysis and deep learning techniques. A recurrent neural network (LSTM) was implemented to capture temporal dependencies in the sensor readings. The model was trained on historical data that included examples of normal operation and various failure modes.",
    results: "The predictive maintenance system achieved 92% accuracy in predicting equipment failures up to 72 hours in advance. This early warning system has reduced unplanned downtime by 35% and decreased maintenance costs by 20% by allowing for more efficient scheduling of maintenance activities and avoiding emergency repairs.",
    imageUrl: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Machine Learning",
    categoryColor: "accent",
    technologies: ["TensorFlow", "Time Series", "IoT"],
    githubUrl: "https://github.com/angus-gair/predictive-maintenance",
    liveUrl: "#",
    hasJupyterNotebook: true,
    jupyterNotebookId: "predictive-maintenance-notebook",
    hasTableauDashboard: false
  },
  {
    id: "financial-analysis",
    title: "Financial Analysis Tool",
    description: "An interactive tool for analyzing financial data with customizable charts and predictive analytics capabilities.",
    fullDescription: "The Financial Analysis Tool is a comprehensive application designed to help financial analysts and business owners visualize and analyze financial data. It provides interactive charts, trend analysis, and forecasting features to support informed decision-making.",
    methodology: "The application was built using React for the frontend interface and a Flask API backend for data processing. D3.js was used for creating interactive data visualizations. The forecasting models use ARIMA and Prophet algorithms to predict future trends based on historical financial data.",
    results: "The tool has been adopted by several financial departments, resulting in a 40% reduction in time spent on manual data analysis and reporting. Users have reported improved decision-making accuracy and greater confidence in financial forecasts. The customizable dashboard allows users to focus on metrics that are most relevant to their specific needs.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Data Visualization",
    categoryColor: "primary",
    technologies: ["React", "D3.js", "Flask API"],
    githubUrl: "https://github.com/angus-gair/financial-analysis",
    liveUrl: "#",
    hasJupyterNotebook: false,
    hasTableauDashboard: true,
    tableauDashboardId: "mmm-model"
  },
  {
    id: "nlp-api",
    title: "Natural Language Processing API",
    description: "A RESTful API for text analysis, sentiment detection, and entity recognition using state-of-the-art NLP models.",
    fullDescription: "This Natural Language Processing API provides a comprehensive suite of text analysis capabilities including sentiment analysis, entity recognition, text classification, and language detection. It's designed to be easily integrated into applications that require advanced text processing features.",
    methodology: "The API is built using Python with FastAPI for the web framework. It incorporates multiple NLP libraries including NLTK, spaCy, and Hugging Face's transformers for different analysis tasks. The API is containerized using Docker and deployed with Kubernetes for scalability.",
    results: "The NLP API processes over 1 million text requests daily with an average response time of 120ms. It has been integrated into various applications, including a customer support system that uses sentiment analysis to prioritize tickets, resulting in a 30% improvement in response time for urgent issues.",
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "NLP",
    categoryColor: "accent",
    technologies: ["NLTK", "spaCy", "FastAPI"],
    githubUrl: "https://github.com/angus-gair/nlp-api",
    liveUrl: "#",
    hasJupyterNotebook: true,
    jupyterNotebookId: "nlp-api-notebook",
    hasTableauDashboard: false
  },
  {
    id: "jupyter-collection",
    title: "Jupyter Notebook Collection",
    description: "A collection of interactive Jupyter notebooks demonstrating various data analysis techniques and machine learning algorithms.",
    fullDescription: "This collection of Jupyter notebooks serves as both a learning resource and a reference for data science practitioners. It covers a wide range of topics from basic data manipulation to advanced machine learning techniques, with detailed explanations and executable code examples.",
    methodology: "Each notebook is carefully structured to provide theoretical background, practical implementation, and real-world examples. The notebooks use datasets from various domains to demonstrate the versatility of the techniques. All code is thoroughly documented to facilitate understanding and adaptation.",
    results: "The notebook collection has been accessed by over 10,000 data science students and professionals. It has been incorporated into various educational curricula and professional training programs. Users report that the interactive nature of the notebooks significantly enhances learning compared to traditional teaching methods.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Data Analysis",
    categoryColor: "secondary",
    technologies: ["Jupyter", "Pandas", "NumPy"],
    githubUrl: "https://github.com/angus-gair/jupyter-collection",
    liveUrl: "#",
    hasJupyterNotebook: true,
    jupyterNotebookId: "jupyter-collection-notebook",
    hasTableauDashboard: false
  },
  {
    id: "tableau-integration",
    title: "Tableau Dashboard Integration",
    description: "A set of interactive business intelligence dashboards integrated with web applications for real-time data exploration.",
    fullDescription: "This project demonstrates how to effectively integrate Tableau dashboards into web applications, providing users with powerful business intelligence capabilities within their existing workflows. The integration includes custom filtering, parameter passing, and event handling between the web application and embedded dashboards.",
    methodology: "The integration was implemented using the Tableau JavaScript API to embed dashboards into web applications. Custom connectors were developed to synchronize data between the application's database and Tableau. The user interface was designed to provide a seamless experience when transitioning between the application and the embedded dashboards.",
    results: "The integrated dashboards have significantly improved data accessibility for business users, reducing the time to insights by 60%. The solution has been deployed across multiple departments, standardizing reporting processes while maintaining flexibility for department-specific needs. User engagement with data has increased by 45% since implementation.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Business Intelligence",
    categoryColor: "primary",
    technologies: ["Tableau", "JavaScript", "Web API"],
    githubUrl: "https://github.com/angus-gair/tableau-integration",
    liveUrl: "#",
    hasJupyterNotebook: false,
    hasTableauDashboard: true,
    tableauDashboardId: "rewards-performance"
  }
];
