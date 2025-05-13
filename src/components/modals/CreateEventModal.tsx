
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { EventTypeSelector } from "@/components/events/EventTypeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ApiClient } from "@/lib/api-client";
import { useEventContext } from "@/context/EventContext";
import { toast } from "sonner";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventModal({ open, onOpenChange }: CreateEventModalProps) {
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
      onOpenChange(false);
      navigate("/dashboard", {
        state: {
          eventId: data.event_id,
          eventName,
        },
      });
    },
    onError: (error) => {
      console.error("Failed to create event:", error);
      toast.error("Failed to create event");
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

  const handleDialogClose = () => {
    setEventName("");
    setEventType("");
    setCreatorName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Create a new event to add questions and invite participants
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isPending}
            >
              {isPending ? "Creating Event..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
