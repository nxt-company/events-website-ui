
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface InviteFormProps {
  onSubmit: (username: string) => Promise<void>;
  isSubmitting: boolean;
}

export function InviteForm({ onSubmit, isSubmitting }: InviteFormProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    await onSubmit(username);
    setUsername("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite User</CardTitle>
        <CardDescription>
          Send an invite to a user to join your event
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-1">
            <Label htmlFor="invite-username">Username</Label>
            <Input
              id="invite-username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !username.trim()}
          >
            {isSubmitting ? "Sending Invite..." : "Send Invite"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
