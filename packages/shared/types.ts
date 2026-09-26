import * as z from 'zod'


type Id = string;

// Sent from frontend
export type TeacherIdBody = { uid: Id; }
export type StudentBody = { uid: Id; alias?: string; }
export type SessionIdParam = { sid: Id; }

// Response from backend
export type SessionIdResponse = { sid: Id; }
export type IdResponse = { todo_id: Id; }
export type ErrorResponse = { message: string; }
export type StudentPollResponse = {
	code: number;
	message: string;
	questionActive: boolean;
}
export type TeacherPollResponse = {
	code: number;
	message: string;
	questionActive: boolean;
	participants: Id[];  // students
}


export const schemas = {
	sessionIdResponse: z.object({
		sid: z.string()
	})
}