import * as z from 'zod'


type Id = string;

// Sent from frontend
export type TeacherIdBody = { uid: Id; }
export type StudentBody = { uid: Id; alias?: string; }
export type SessionIdParam = { sid: Id; }
export type StudentAnswer = z.infer<typeof studentAnswer>

// Response from backend
export type SessionIdResponse = z.infer<typeof schemas.sessionIdResponse>
export type IdResponse = { todo_id: Id; }
export type ErrorResponse = { message: string; }
export type StudentPollResponse = z.infer<typeof schemas.studentPollResponse>
//  {
// 	code: number;
// 	message: string;
// 	questionActive: boolean;
// }
export type TeacherPollResponse = z.infer<typeof schemas.teacherPollResponse>


const studentAnswer = z.object({
	uid: z.string(),
	value: z.number()
})

export const schemas = {
	sessionIdResponse: z.object({
		sid: z.string()
	}),
	studentAnswer,
	teacherPollResponse: z.object({
		code: z.number(),
		message: z.string(),
		questionActive: z.boolean(),
		participants: z.array(z.string()),
		answers: z.array(studentAnswer)
	}),
	studentPollResponse: z.object({
		code: z.number(),
		message: z.string(),
		questionActive: z.boolean()
	})
}
