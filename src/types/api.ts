
// Event related types
export interface Event {
  id: string;
  name: string;
  type: string;
  creator_username: string;
  creator_code?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  questions: Question[];
  invites: Invite[];
  user_answers: UserAnswer[];
}

export interface Question {
  id: string;
  event_id: string;
  text: string;
  options: string[];
  correct_answer: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Invite {
  event_id: string;
  username: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Answer {
  question_id: string;
  selected_option: number;
}

export interface UserAnswer {
  id: number;
  event_id: string;
  username: string;
  answers: Answer[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface UserAnswerDetails {
  question_id: string;
  question_text: string;
  options: string[];
  selected_option: number;
  correct_option: number;
}

export interface UserResult {
  username: string;
  total_questions: number;
  correct_answers: number;
  answers: UserAnswerDetails[];
}

// API Request/Response types
export interface CreateEventRequest {
  name: string;
  type: string;
  creator_username: string;
}

export interface CreateEventResponse {
  event_id: string;
  creator_code: string;
}

export interface AddQuestionRequest {
  text: string;
  options: string[];
  correct_answer: number;
}

export interface AddQuestionResponse {
  event_id: string;
  question_id: string;
}

export interface InviteUserRequest {
  username: string;
}

export interface InviteUserResponse {
  event_id: string;
  invite_code: string;
  invite_url: string;
  message: string;
}

export interface JoinEventRequest {
  event_name: string;
  invite_code: string;
  username: string;
}

export interface JoinEventResponse {
  event: Event;
}

export interface SubmitAnswersRequest {
  username: string;
  answers: Answer[];
}

export interface CreatorAccessRequest {
  event_name: string;
  creator_code: string;
}

export interface CreatorAccessResponse {
  event: Event;
}

export interface ResultsResponse {
  results: UserResult[];
}

export interface SubmissionStatusResponse {
  submitted: boolean;
  answers: Answer[];
}

export interface ErrorResponse {
  error: string;
}
