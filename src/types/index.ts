export interface Event {
  id: string;
  name: string;
  type: string;
  creator_code: string;
  questions?: Question[];
  invites?: Invite[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correct_answer: number;
}

export interface Invite {
  invite_code: string;
  username: string;
}

export interface UserResult {
  username: string;
  correct_answers: number;
  total_questions: number;
  answers: Answer[];
}

export interface Answer {
  question_text: string;
  options: string[];
  selected_option: number;
  correct_option: number;
}