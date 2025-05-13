
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Event } from "@/types/api";

interface EventContextType {
  eventData: Event | null;
  setEventData: (event: Event | null) => void;
  creatorCode: string | null;
  setCreatorCode: (code: string | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  clearEventData: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [eventData, setEventData] = useState<Event | null>(null);
  const [creatorCode, setCreatorCode] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // Load stored data on initial render
  useEffect(() => {
    const storedUsername = localStorage.getItem("event-username");
    const storedCreatorCode = localStorage.getItem("event-creator-code");
    
    if (storedUsername) setUsername(storedUsername);
    if (storedCreatorCode) setCreatorCode(storedCreatorCode);
  }, []);

  // Update localStorage when values change
  useEffect(() => {
    if (username) localStorage.setItem("event-username", username);
    else localStorage.removeItem("event-username");
  }, [username]);

  useEffect(() => {
    if (creatorCode) localStorage.setItem("event-creator-code", creatorCode);
    else localStorage.removeItem("event-creator-code");
  }, [creatorCode]);

  const clearEventData = () => {
    setEventData(null);
    setCreatorCode(null);
    setUsername(null);
    localStorage.removeItem("event-username");
    localStorage.removeItem("event-creator-code");
  };

  return (
    <EventContext.Provider
      value={{
        eventData,
        setEventData,
        creatorCode,
        setCreatorCode,
        username,
        setUsername,
        clearEventData
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export const useEventContext = () => {
  const context = useContext(EventContext);
  
  if (context === undefined) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  
  return context;
};
