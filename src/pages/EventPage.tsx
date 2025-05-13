
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { QuestionAnswerForm } from "@/components/questions/QuestionAnswerForm";
import { QuestionList } from "@/components/questions/QuestionList";
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
import { Answer } from "@/types/api";

export function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { eventData, username } = useEventContext();

  // Check submission status
  const { 
    data: submissionStatus, 
    isLoading: isCheckingSubmission,
    isError: isSubmissionError
  } = useQuery({
    queryKey: ["submission-status", eventId, username],
    queryFn: () => {
      if (!eventId || !username) {
        throw new Error("Missing event ID or username");
      }
      return ApiClient.getSubmissionStatus(eventId, username);
    },
    enabled: !!eventId && !!username,
  });

  // Handle redirect if no event data and no username
  useEffect(() => {
    if (!eventData && !username) {
      toast.error("You need to join this event first");
      navigate("/join-event");
    }
  }, [eventData, username, navigate]);

  // Submit answers mutation
  const { mutate: submitAnswers, isPending: isSubmitting } = useMutation({
    mutationFn: (answers: Answer[]) => {
      if (!eventId || !username) {
        throw new Error("Missing event ID or username");
      }
      return ApiClient.submitAnswers(eventId, {
        username,
        answers,
      });
    },
    onSuccess: () => {
      toast.success("Answers submitted successfully!");
      // We could refetch the submission status here if needed
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: (error) => {
      console.error("Failed to submit answers:", error);
    },
  });

  // Handle answer submission
  const handleSubmitAnswers = async (answers: Answer[]) => {
    await submitAnswers(answers);
  };

  if (!eventData && isCheckingSubmission) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <p>Loading event data...</p>
        </div>
      </MainLayout>
    );
  }

  if (!eventData && isSubmissionError) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-3">Event Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The event you are looking for does not exist or you don't have access to it.
          </p>
          <a href="/join-event">Join an Event</a>
        </div>
      </MainLayout>
    );
  }

  const hasSubmitted = submissionStatus?.submitted ?? false;
  const existingAnswers = submissionStatus?.answers;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{eventData?.name}</h1>
          <p className="text-muted-foreground">
            Type: {eventData?.type} • Participant: {username}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {eventData?.questions?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No questions have been added to this event yet.
                </p>
              </CardContent>
            </Card>
          ) : hasSubmitted ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Answers</CardTitle>
                <CardDescription>
                  You have already submitted your answers for this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionAnswerForm
                  questions={eventData?.questions || []}
                  onSubmit={async () => {}}
                  isSubmitting={false}
                  existingAnswers={existingAnswers}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Answer Questions</CardTitle>
                <CardDescription>
                  Select your answers and submit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionAnswerForm
                  questions={eventData?.questions || []}
                  onSubmit={handleSubmitAnswers}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
