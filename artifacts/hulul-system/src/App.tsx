import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Dashboard from "@/pages/Dashboard";
import Workers from "@/pages/Workers";
import Transfers from "@/pages/Transfers";
import Tasks from "@/pages/Tasks";
import Finance from "@/pages/Finance";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // since it's local storage, don't refetch on window focus
      retry: false,
    }
  }
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/workers" component={Workers} />
      <Route path="/transfers" component={Transfers} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/finance" component={Finance} />
      <Route path="/reports" component={Reports} />
      {/* Fallbacks for un-implemented pages pointing to Dashboard for completeness */}
      <Route path="/attendance" component={Dashboard} />
      <Route path="/settings" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
