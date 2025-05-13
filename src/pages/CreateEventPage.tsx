
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { EventTypeSelector } from "@/components/events/EventTypeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiClient } from "@/lib/api-client";
import { useEventContext } from "@/context/EventContext";
import { toast } from "sonner";

export function CreateEventPage() {
  const navigate = useNavigate();
  const { setUsername, setCreatorCode } = useEventContext();

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [creatorName, setCreatorName] = useState("");

  const { mutate: createEvent, isPending } = useMutation({
    mutationFn: () => 
      ApiClient.createEvent({
        name: eventName,
        type: eventType,
        creator_username: creatorName,
      }),
    onSuccess: (data) => {
      setUsername(creatorName);
      setCreatorCode(data.creator_code);
      toast.success("Event created successfully!");
      navigate("/dashboard", {
        state: {
          eventId: data.event_id,
          eventName,
        },
      });
    },
    onError: (error) => {
      console.error("Failed to create event:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventName.trim() || !eventType || !creatorName.trim()) {
      toast.error("Please complete all fields");
      return;
    }
    
    createEvent();
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>
              Create a new event to add questions and invite participants
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="event-name">Event Name</Label>
                <Input
                  id="event-name"
                  placeholder="Enter event name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  disabled={isPending}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="event-type">Event Type</Label>
                <EventTypeSelector
                  value={eventType}
                  onValueChange={setEventType}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="creator-name">Your Username</Label>
                <Input
                  id="creator-name"
                  placeholder="Enter your username"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Creating Event..." : "Create Event"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
