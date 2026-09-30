import express, { type RequestHandler } from 'express'
import { generateId } from '../../../packages/shared/utils.ts'
import { type ErrorResponse, type TeacherIdBody, type IdResponse, type SessionIdResponse, type StudentBody, type StudentPollResponse, type TeacherPollResponse, type SessionIdParam, schemas } from '../../../packages/shared/types.ts'
import * as z from 'zod'


const router = express.Router()

type Answer = { value: number; studentId: string; }
type ServerSession = {
	sid: string;  // session id
	teacherId: string;
	studentIds: string[];
	questionActive: boolean;
	answers: Answer[];
}
// const sessions: Map<string, ServerSession> = new Map()
const sessions: ServerSession[] = []

/*
[x] teacher, request new session
[x] teacher, close session
[ ] request open question
[ ] request close question
[ ] server, register this student. Servern behöver svara med: status för eventuellt pågående fråga.
[ ] unregister student
[ ] poll - "vad händer" - för student och teacher
*/

// TODO: remove test route
router.get('/', (req, res) => {
	res.send('GET success')
})

type IdParam = { id: string; }


const validateSid: RequestHandler = (req, res, next) => {
	const s: ServerSession | undefined = sessions.find(x => x.sid === req.params.sid)
	if( !s ) {
		res.status(400).send({ message: 'Ingen pågående session.' })
		return
	}
	next()
}
const validateAnswer: RequestHandler = (req, res, next) => {
	const parsed = z.safeParse(schemas.studentAnswer, req.body)
	if( !parsed.success ) {
		res.status(400).send({ message: 'Felaktigt format på studentens svar.' })
		return
	}
	next()
}


// POST /api/session, body: { id }
router.post<{}, SessionIdResponse | ErrorResponse, TeacherIdBody>('/session', (req, res) => {
	const uid = req.body?.uid
	const s = sessions.find(x => x.teacherId === uid)
	if( s ) {
		res.status(400).send({ message: `You already have a session: ${s.sid}.` })
		return
	}
	const sid = generateId()
	sessions.push({
		sid,
		teacherId: uid,
		studentIds: [],
		questionActive: false,
		answers: []
	})
	console.log(`Created new session: ${sid}.`)
	res.status(200).send({ sid })
})

// DELETE /api/session/:sid
router.delete<SessionIdParam, void>('/session/:sid', (req, res) => {
	const sid = req.params.sid
	const s = sessions.find(x => x.sid === sid)
	if( s ) {
		deleteFromArray(sessions, x => x.sid !== sid)
		res.sendStatus(204)
		console.log(`Deleted session: ${sid}.`)
		return
	}
	res.sendStatus(404)
})
function deleteFromArray<T>(array: T[], condition: (t: T) => boolean): void {
	const index = array.findIndex(item => condition(item))
	array.splice(index, 1)
	console.log(`Array after deletion`, array)
}


// GET /api/poll/s/:sessionId
router.get<SessionIdParam, StudentPollResponse>('/poll/s/:sid', validateSid, (req, res) => {
	const s = sessions.find(x => x.sid === req.params.sid)!

	res.send({
		code: 200,
		message: 'Ok',
		questionActive: s.questionActive
	})
})

// GET /api/poll/t/:sessionId
router.get<SessionIdParam, TeacherPollResponse>('/poll/t/:sid', validateSid, (req, res) => {
	const s = sessions.find(x => x.sid === req.params.sid)!

	res.send({
		code: 200,
		message: 'Ok',
		questionActive: s.questionActive,
		participants: s.studentIds
	})
})


// POST /api/question/t/:sessionId - sätt igång fråga
router.post<SessionIdParam, void | ErrorResponse>('/question/t/:sid', validateSid, (req, res) => {
	// om existerande fråga, felkod 400?
	// annars starta ny fråga, kod 204
	const s: ServerSession = sessions.find(x => x.sid === req.params.sid)!

	if( s.questionActive ) {
		res.status(400).send({ message: 'Det finns redan en pågående fråga.' })
		return
	}
	s.answers = []
	s.questionActive = true
	res.sendStatus(204)
})


// DELETE /api/question/t/:sessionId - avsluta fråga
router.delete<SessionIdParam, void | ErrorResponse>('/question/t/:sid', validateSid, (req, res) => {
	const s: ServerSession = sessions.find(x => x.sid === req.params.sid)!

	if( !s.questionActive ) {
		res.status(400).send({ message: 'Det finns ingen fråga att stänga.' })
		return
	}
	s.questionActive = false
	res.sendStatus(204)
})



// POST /api/question/s/:sid, body: {value: number}
router.post<SessionIdParam, void | ErrorResponse, Answer>('/question/s/:sid', validateSid, validateAnswer, (req, res) => {
	const s: ServerSession = sessions.find(x => x.sid === req.params.sid)!
	const a: Answer = req.body

	const index = s.answers.findIndex(x => x.studentId === a.studentId)
	if( index === -1 ) {
		s.answers.push(a)
		res.sendStatus(201)  // ny röst
	} else {
		s.answers[index] = a
		res.sendStatus(204)  // uppdaterat värde
	}
})


export default router
