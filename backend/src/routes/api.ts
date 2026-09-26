import express from 'express'
import { generateId } from '../../../packages/shared/utils.ts'
import { type ErrorResponse, type IdBody, type IdResponse } from '../../../packages/shared/types.ts'


const router = express.Router()

type ServerSession = {
	id: string;
	teacherId: string;
	studentIds: string[];
}
const sessions: Map<string, ServerSession> = new Map()

/*
[x] teacher, request new session
[ ] teacher, close session
[ ] request open question
[ ] request close question
[ ] server, register this student. Servern behöver svara med: status för eventuellt pågående fråga.
[ ] unregister student
[ ] poll - "vad händer" - för student och teacher
*/

router.get('/', (req, res) => {
	res.send('GET success')
})


// POST /api/session, body: { id }
router.post<{}, IdResponse | ErrorResponse, IdBody>('/session', (req, res) => {
	console.log(`POST new api session`)
	const id = req.body?.id
	if( sessions.has(id) ) {
		res.status(400).send({ message: 'Session already created' })
		return
	}
	const teacherId = generateId()
	sessions.set(id, {
		id,
		teacherId,
		studentIds: []
	})
	res.status(200).send({ id: teacherId })
})


export default router
