
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { QuestionForm } from "@/components/questions/QuestionForm";
import { QuestionList } from "@/components/questions/QuestionList";
import { InviteForm } from "@/components/invites/InviteForm";
import { InviteList } from "@/components/invites/InviteList";
import { ResultsList } from "@/components/results/ResultsList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiClient } from "@/lib/api-client";
import { useEventContext } from "@/context/EventContext";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { AddQuestionRequest, Question, Invite } from "@/types/api";

interface LocationState {
  eventId?: string;
  eventName?: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventData, setEventData, username, creatorCode } = useEventContext();
  const [activeTab, setActiveTab] = useState("questions");

  const locationState = location.state as LocationState;
  const eventId = eventData?.id || locationState?.eventId;
  const eventName = eventData?.name || locationState?.eventName;

  // Fetch event data if needed
  const { refetch: refetchEvent } = useQuery({
    queryKey: ["event-access", eventName],
    queryFn: async () => {
      if (!eventName || !creatorCode) {
        throw new Error("Missing event name or creator code");
      }
      return ApiClient.creatorAccess({
        event_name: eventName,
        creator_code: creatorCode as string,
      });
    },
    enabled: !!eventName && !!creatorCode && !eventData,
    meta: {
      onSuccess: (data) => {
        setEventData(data.event);
      },
      onError: () => {
        console.error("Failed to access event");
        toast.error("Failed to access event");
        navigate("/");
      }
    }
  });

  // Fetch results
  const {
    data: resultsData,
    isLoading: isResultsLoading,
    refetch: refetchResults,
  } = useQuery({
    queryKey: ["event-results", eventId],
    queryFn: async () => {
      if (!eventId || !creatorCode) {
        throw new Error("Missing event ID or creator code");
      }
      return ApiClient.getEventResults(eventId, creatorCode as string);
    },
    enabled: !!eventId && !!creatorCode,
  });

  // Add question mutation
  const { mutate: addQuestionMutate, isPending: isAddingQuestion } = useMutation({
    mutationFn: (data: AddQuestionRequest) => {
      if (!eventId) {
        throw new Error("Missing event ID");
      }
      return ApiClient.addQuestion(eventId, data);
    },
    onSuccess: () => {
      toast.success("Question added successfully");
      refetchEvent();
    },
    onError: (error) => {
      console.error("Failed to add question:", error);
    },
  });

  // Delete question mutation
  const { mutate: deleteQuestionMutate } = useMutation({
    mutationFn: (questionId: string) => {
      if (!eventId || !creatorCode) {
        throw new Error("Missing event ID or creator code");
      }
      return ApiClient.deleteQuestion(eventId, questionId, creatorCode as string);
    },
    onSuccess: () => {
      toast.success("Question deleted successfully");
      refetchEvent();
    },
    onError: (error) => {
      console.error("Failed to delete question:", error);
    },
  });

  // Invite user mutation
  const { mutate: inviteUserMutate, isPending: isInvitingUser } = useMutation({
    mutationFn: (username: string) => {
      if (!eventId) {
        throw new Error("Missing event ID");
      }
      return ApiClient.inviteUser(eventId, { username });
    },
    onSuccess: () => {
      toast.success("Invite sent successfully");
      refetchEvent();
    },
    onError: (error) => {
      console.error("Failed to invite user:", error);
    },
  });

  // Delete invite mutation
  const { mutate: deleteInviteMutate } = useMutation({
    mutationFn: (inviteCode: string) => {
      if (!eventId || !creatorCode) {
        throw new Error("Missing event ID or creator code");
      }
      return ApiClient.deleteInvite(eventId, inviteCode, creatorCode as string);
    },
    onSuccess: () => {
      toast.success("Invite deleted successfully");
      refetchEvent();
    },
    onError: (error) => {
      console.error("Failed to delete invite:", error);
    },
  });

  // Update results when tab changes to results
  useEffect(() => {
    if (activeTab === "results") {
      refetchResults();
    }
  }, [activeTab, refetchResults]);

  const copyCreatorCode = () => {
    if (!creatorCode) return;
    
    navigator.clipboard.writeText(creatorCode);
    toast.success("Creator code copied to clipboard");
  };

  if (!eventData && !eventName) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-3">No Event Selected</h2>
          <p className="text-muted-foreground mb-4">
            You have not created or accessed any event yet.
          </p>
          <Button asChild>
            <a href="/create-event">Create a New Event</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{eventData?.name || eventName}</h1>
            <p className="text-muted-foreground">
              {eventData?.type && `Type: ${eventData?.type}`} {" • "} 
              Creator: {username || eventData?.creator_username}
            </p>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-muted/60 rounded-md">
            <div className="text-sm">
              <span className="text-muted-foreground">Creator Code:</span>{" "}
              <span className="font-mono">
                {creatorCode ? `${creatorCode.substring(0, 8)}...` : "N/A"}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={copyCreatorCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="questions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full md:w-96">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="invites">Invites</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="questions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuestionForm 
                  onSubmit={(data) => addQuestionMutate(data)} 
                  isSubmitting={isAddingQuestion} 
                />
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Questions List</CardTitle>
                      <CardDescription>
                        Manage the questions in your event
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <QuestionList
                        questions={eventData?.questions || []}
                        onDelete={(id) => deleteQuestionMutate(id)}
                        isCreator={true}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="invites" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InviteForm 
                  onSubmit={(username) => inviteUserMutate(username)} 
                  isSubmitting={isInvitingUser} 
                />
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Invites List</CardTitle>
                      <CardDescription>
                        Manage user invites for your event
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InviteList
                        invites={eventData?.invites || []}
                        onDelete={(code) => deleteInviteMutate(code)}
                        isCreator={true}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Results</CardTitle>
                  <CardDescription>
                    View participant submissions and scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isResultsLoading ? (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">Loading results...</p>
                    </div>
                  ) : (
                    <ResultsList results={resultsData?.results || []} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
}
