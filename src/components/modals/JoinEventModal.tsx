
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
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

interface JoinEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinEventModal({ open, onOpenChange }: JoinEventModalProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUsername, setEventData } = useEventContext();

  const [eventName, setEventName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  // Extract code from URL if present
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setInviteCode(codeFromUrl);
    }
  }, [searchParams]);

  const { mutate: joinEvent, isPending } = useMutation({
    mutationFn: () =>
      ApiClient.joinEvent({
        event_name: eventName,
        invite_code: inviteCode,
        username: usernameInput,
      }),
    onSuccess: (data) => {
      setUsername(usernameInput);
      setEventData(data.event);
      toast.success("Successfully joined the event!");
      onOpenChange(false);
      navigate(`/event/${data.event.id}`);
    },
    onError: (error) => {
      console.error("Failed to join event:", error);
      toast.error("Failed to join event");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventName.trim() || !inviteCode.trim() || !usernameInput.trim()) {
      toast.error("Please complete all fields");
      return;
    }
    
    joinEvent();
  };

  const handleDialogClose = () => {
    setEventName("");
    setInviteCode("");
    setUsernameInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Event</DialogTitle>
          <DialogDescription>
            Enter your details to join an existing event
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
            <Label htmlFor="invite-code">Invite Code</Label>
            <Input
              id="invite-code"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={isPending}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="username">Your Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              disabled={isPending}
            />
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isPending}
            >
              {isPending ? "Joining Event..." : "Join Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
