import express from 'express'
import { generateId } from '../../../packages/shared/utils.ts'
import { type ErrorResponse, type IdBody, type IdResponse, type StudentBody, type StudentPollResponse, type TeacherPollResponse } from '../../../packages/shared/types.ts'


const router = express.Router()

type ServerSession = {
	id: string;
	teacherId: string;
	studentIds: string[];
	questionActive: boolean;
}
const sessions: Map<string, ServerSession> = new Map()

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
router.post<{}, IdResponse | ErrorResponse, IdBody>('/session', (req, res) => {
	const id = req.body?.id
	if( sessions.has(id) ) {
		res.status(400).send({ message: 'Session already created' })
		return
	}
	const teacherId = generateId()
	sessions.set(id, {
		id,
		teacherId,
		studentIds: [],
		questionActive: false
	})
	console.log(`Created new session: ${teacherId}.`)
	res.status(200).send({ id: teacherId })
})

// DELETE /api/session/:id
router.delete<IdParam, void>('/session/:id', (req, res) => {
	const id = req.params.id
	if( sessions.has(id) ) {
		sessions.delete(id)
		res.sendStatus(204)
		console.log(`Deleted session: ${id}.`)
		return
	}
	res.sendStatus(404)
})


// POST /api/poll/student/:sessionId, body { ?? }
router.post<IdParam, StudentPollResponse, StudentBody>('/poll/student/:id', (req, res) => {
	const id = req.params.id
	const s = sessions.get(id)
	if( !id || !s) {
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

// POST /api/poll/teacher/:sessionId
router.post<IdParam, TeacherPollResponse>('/poll/teacher/:sessionId', (req, res) => {
	const sid = req.params.id
	const s = sessions.get(sid)
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


export default router
