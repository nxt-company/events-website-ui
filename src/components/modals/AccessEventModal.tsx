
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface AccessEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccessEventModal({ open, onOpenChange }: AccessEventModalProps) {
  const navigate = useNavigate();
  const { setEventData, setCreatorCode } = useEventContext();
  const [eventName, setEventName] = useState("");
  const [creatorCodeInput, setCreatorCodeInput] = useState("");

  const accessMutation = useMutation({
    mutationFn: () => 
      ApiClient.creatorAccess({
        event_name: eventName,
        creator_code: creatorCodeInput,
      }),
    onSuccess: (data) => {
      setEventData(data.event);
      setCreatorCode(creatorCodeInput);
      toast.success("Event accessed successfully!");
      onOpenChange(false);
      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error("Failed to access event:", error);
      toast.error(error?.message || "Failed to access event");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventName || !creatorCodeInput) {
      toast.error("Please fill all fields");
      return;
    }

    accessMutation.mutate();
  };

  const handleDialogClose = () => {
    setEventName("");
    setCreatorCodeInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Access Event</DialogTitle>
          <DialogDescription>
            Enter your event name and creator code to manage your event
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="creatorCode">Creator Code</Label>
            <Input
              id="creatorCode"
              placeholder="Enter your creator code"
              value={creatorCodeInput}
              onChange={(e) => setCreatorCodeInput(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={accessMutation.isPending}>
              {accessMutation.isPending ? "Accessing..." : "Access Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
