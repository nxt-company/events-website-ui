
import { useState } from "react";
import { Invite } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash } from "lucide-react";
import { toast } from "sonner";

interface InviteListProps {
  invites: Invite[];
  onDelete?: (inviteCode: string) => void;
  isCreator: boolean;
}

export function InviteList({ invites, onDelete, isCreator }: InviteListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  if (invites.length === 0) {
    return (
      <div className="bg-muted/40 rounded-lg py-8 text-center">
        <p className="text-muted-foreground">No invites have been created yet.</p>
      </div>
    );
  }

  const copyInviteUrl = (inviteCode: string) => {
    const origin = window.location.origin;
    const inviteUrl = `${origin}/join-event?code=${inviteCode}`;
    
    navigator.clipboard.writeText(inviteUrl);
    toast.success("Invite URL copied to clipboard");
    
    setCopiedCode(inviteCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-4">
      {invites.map((invite) => (
        <Card key={invite.invite_code}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium">
                {invite.username}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyInviteUrl(invite.invite_code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {isCreator && onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(invite.invite_code)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-xs text-muted-foreground">Invite Code:</div>
              <div className="font-mono text-sm bg-muted px-2 py-1 rounded-md">
                {invite.invite_code}
                {copiedCode === invite.invite_code && (
                  <span className="ml-2 text-xs font-medium text-green-500">Copied!</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
