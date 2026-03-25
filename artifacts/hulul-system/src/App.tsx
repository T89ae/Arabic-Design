import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Dashboard     from "@/pages/Dashboard";
import Workers       from "@/pages/Workers";
import Transfers     from "@/pages/Transfers";
import Tasks         from "@/pages/Tasks";
import Finance       from "@/pages/Finance";
import Reports       from "@/pages/Reports";
import Expenses      from "@/pages/Expenses";
import Sales         from "@/pages/Sales";
import Inventory     from "@/pages/Inventory";
import Contacts      from "@/pages/Contacts";
import Brokers       from "@/pages/Brokers";
import Attendance    from "@/pages/Attendance";
import SaudiWorkers  from "@/pages/SaudiWorkers";
import ActivityLog   from "@/pages/ActivityLog";
import NotFound      from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    }
  }
});

function Router() {
  return (
    <Switch>
      <Route path="/"              component={Dashboard} />
      <Route path="/workers"       component={Workers} />
      <Route path="/transfers"     component={Transfers} />
      <Route path="/tasks"         component={Tasks} />
      <Route path="/finance"       component={Finance} />
      <Route path="/reports"       component={Reports} />
      <Route path="/expenses"      component={Expenses} />
      <Route path="/sales"         component={Sales} />
      <Route path="/inventory"     component={Inventory} />
      <Route path="/contacts"      component={Contacts} />
      <Route path="/brokers"       component={Brokers} />
      <Route path="/attendance"    component={Attendance} />
      <Route path="/saudi-workers" component={SaudiWorkers} />
      <Route path="/activity"      component={ActivityLog} />
      <Route path="/settings"      component={Dashboard} />
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
