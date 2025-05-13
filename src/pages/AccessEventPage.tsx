
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEventContext } from "@/context/EventContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
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
import { toast } from "sonner";

export function AccessEventPage() {
  const navigate = useNavigate();
  const { setEventData, setCreatorCode } = useEventContext();
  const [eventName, setEventName] = useState("");
  const [creatorCodeInput, setCreatorCodeInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error("Failed to access event:", error);
      toast.error(error?.message || "Failed to access event");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventName || !creatorCodeInput) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    accessMutation.mutate();
    setIsSubmitting(false);
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Access Event</CardTitle>
            <CardDescription>
              Enter your event name and creator code to manage your event
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting || accessMutation.isPending}>
                {isSubmitting || accessMutation.isPending ? "Accessing..." : "Access Event"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
