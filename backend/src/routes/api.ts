import express from 'express'
import { generateId } from '../../../packages/shared/utils.ts'
import { type ErrorResponse, type TeacherIdBody, type IdResponse, type SessionIdResponse, type StudentBody, type StudentPollResponse, type TeacherPollResponse, type SessionIdParam } from '../../../packages/shared/types.ts'


const router = express.Router()

type ServerSession = {
	sid: string;  // session id
	teacherId: string;
	studentIds: string[];
	questionActive: boolean;
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
		questionActive: false
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


// POST /api/poll/s/:sessionId, body { ?? }
router.post<SessionIdParam, StudentPollResponse, StudentBody>('/poll/s/:sid', (req, res) => {
	const sid = req.params.sid
	const s = sessions.find(x => x.sid === sid)
	if( !sid || !s) {
		res.send({
			code: 404,
			message: 'No session or session closed.',
			questionActive: false
		})
		return
	}

	res.send({
		code: 200,
		message: 'Ok',
		questionActive: s.questionActive
	})
})

// POST /api/poll/t/:sessionId
router.post<SessionIdParam, TeacherPollResponse>('/poll/t/:sessionId', (req, res) => {
	const sid = req.params.sid
	const s = sessions.find(x => x.sid === sid)
	if( !sid || !s ) {
		res.send({
			code: 404,
			message: 'No session or session closed.',
			questionActive: false,
			participants: []
		})
		return
	}

	res.send({
		code: 200,
		message: 'Ok',
		questionActive: s.questionActive,
		participants: s.studentIds
	})
})


// TODO
// POST /api/question/t/:sessionId - sätt igång fråga
router.post<SessionIdParam, void>('/question/t/:sid', (req, res) => {
	// om existerande fråga, felkod 400?
	// annars starta ny fråga, kod 204
})


// TODO
// DELETE /api/question/t/:sessionId - avsluta fråga

export default router
