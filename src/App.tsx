
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/ThemeContext";
import { EventProvider } from "@/context/EventContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { HomePage } from "@/pages/HomePage";
import { CreateEventPage } from "@/pages/CreateEventPage";
import { JoinEventPage } from "@/pages/JoinEventPage";
import { AccessEventPage } from "@/pages/AccessEventPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { EventPage } from "@/pages/EventPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="eventq-theme">
        <EventProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create-event" element={<CreateEventPage />} />
                <Route path="/access-event" element={<AccessEventPage />} />
                <Route path="/join-event" element={<JoinEventPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/event/:eventId" element={<EventPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Toaster />
              <SonnerToaster position="top-right" expand={false} />
            </BrowserRouter>
          </TooltipProvider>
        </EventProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
