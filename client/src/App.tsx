import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import NotebookDetail from "@/pages/NotebookDetail";
import TableauDashboard from "@/components/TableauDashboard";
import Footer from "@/components/Footer";

function Router() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/project/:id" component={ProjectDetail} />
        <Route path="/notebook/:id" component={NotebookDetail} />
        <Route path="/dashboard/:id">
          {(params) => <TableauDashboard dashboardId={params.id} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
