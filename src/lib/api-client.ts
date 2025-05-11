import axios from 'axios';
import type { Event, Question, UserResult } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventsApi = {
  getEventTypes: () => api.get<string[]>('/event-types').then(res => res.data),
  
  createEvent: (data: { name: string; type: string; creator_username: string }) =>
    api.post<{ event_id: string; creator_code: string }>('/events', data).then(res => res.data),
  
  accessEvent: (data: { event_name: string; creator_code: string }) =>
    api.post<{ event: Event }>('/creator-access', data).then(res => res.data),
  
  joinEvent: (data: { event_name: string; invite_code: string; username: string }) =>
    api.post<{ event: Event }>('/join-event', data).then(res => res.data),
  
  addQuestion: (eventId: string, data: { text: string; options: string[]; correct_answer: number }) =>
    api.post<{ question_id: string; event_id: string }>(`/events/${eventId}/questions`, data)
      .then(res => res.data),
  
  inviteUser: (eventId: string, data: { username: string }) =>
    api.post<{ invite_code: string }>(`/events/${eventId}/invite`, data).then(res => res.data),
  
  deleteInvite: (eventId: string, inviteCode: string, creatorCode: string) =>
    api.delete(`/events/${eventId}/invite/${inviteCode}`, { params: { creator_code: creatorCode } }),
  
  deleteQuestion: (eventId: string, questionId: string, creatorCode: string) =>
    api.delete(`/events/${eventId}/questions/${questionId}`, { params: { creator_code: creatorCode } }),
  
  getResults: (eventId: string, creatorCode: string) =>
    api.get<{ results: UserResult[] }>(`/events/${eventId}/results`, { params: { creator_code: creatorCode } })
      .then(res => res.data),
  
  submitAnswers: (eventId: string, data: { username: string; answers: { question_id: string; selected_option: number }[] }) =>
    api.post(`/events/${eventId}/submit-answers`, data).then(res => res.data),
};