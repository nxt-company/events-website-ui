
import { toast } from "sonner";
import {
  AddQuestionRequest,
  AddQuestionResponse,
  CreateEventRequest,
  CreateEventResponse,
  CreatorAccessRequest,
  CreatorAccessResponse,
  ErrorResponse,
  InviteUserRequest,
  InviteUserResponse,
  JoinEventRequest,
  JoinEventResponse,
  ResultsResponse,
  SubmissionStatusResponse,
  SubmitAnswersRequest,
} from "@/types/api";

const API_BASE = "/api/v1";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    const errorData = data as ErrorResponse;
    const errorMessage = errorData.error || "An unknown error occurred";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  return data as T;
}

// API Client class
export class ApiClient {
  // Event Types
  static async getEventTypes(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/event-types`);
    return handleResponse<string[]>(response);
  }

  // Event Creation
  static async createEvent(request: CreateEventRequest): Promise<CreateEventResponse> {
    const response = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<CreateEventResponse>(response);
  }

  // Creator Access
  static async creatorAccess(request: CreatorAccessRequest): Promise<CreatorAccessResponse> {
    const response = await fetch(`${API_BASE}/creator-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<CreatorAccessResponse>(response);
  }

  // Questions
  static async addQuestion(eventId: string, request: AddQuestionRequest): Promise<AddQuestionResponse> {
    const response = await fetch(`${API_BASE}/events/${eventId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<AddQuestionResponse>(response);
  }

  static async deleteQuestion(eventId: string, questionId: string, creatorCode: string): Promise<void> {
    const response = await fetch(`${API_BASE}/events/${eventId}/questions/${questionId}?creator_code=${creatorCode}`, {
      method: "DELETE",
    });
    return handleResponse<void>(response);
  }

  // Invites
  static async inviteUser(eventId: string, request: InviteUserRequest): Promise<InviteUserResponse> {
    const response = await fetch(`${API_BASE}/events/${eventId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<InviteUserResponse>(response);
  }

  static async deleteInvite(eventId: string, inviteCode: string, creatorCode: string): Promise<void> {
    const response = await fetch(`${API_BASE}/events/${eventId}/invite/${inviteCode}?creator_code=${creatorCode}`, {
      method: "DELETE",
    });
    return handleResponse<void>(response);
  }

  // Join Event
  static async joinEvent(request: JoinEventRequest): Promise<JoinEventResponse> {
    const response = await fetch(`${API_BASE}/join-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<JoinEventResponse>(response);
  }

  // Submissions
  static async submitAnswers(eventId: string, request: SubmitAnswersRequest): Promise<void> {
    const response = await fetch(`${API_BASE}/events/${eventId}/submit-answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<void>(response);
  }

  static async getSubmissionStatus(eventId: string, username: string): Promise<SubmissionStatusResponse> {
    const response = await fetch(`${API_BASE}/events/${eventId}/submission-status?username=${username}`);
    return handleResponse<SubmissionStatusResponse>(response);
  }

  // Results
  static async getEventResults(eventId: string, creatorCode: string): Promise<ResultsResponse> {
    const response = await fetch(`${API_BASE}/events/${eventId}/results?creator_code=${creatorCode}`);
    return handleResponse<ResultsResponse>(response);
  }
}
