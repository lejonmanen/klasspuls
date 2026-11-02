import { schemas, type ReactSet, type StudentPollResponse, type TeacherPollResponse } from "@klasspuls/shared/types"
import type { Session, TeacherSession } from "./types"
import { getErrorMessage } from "./utils"
import * as z from 'zod'

// Kommunikation med API:et
const API = `${import.meta.env.BASE_URL}`
function api(path: string, options?: RequestInit): Promise<Response> {
	return fetch((API + path).replace('//', '/'), options)
}


export async function newSession(s: Session, set: ReactSet<Session>) {
	try {
		const response = await api('/api/session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ uid: s.uid })
		})

		const data: unknown = await response.json()
		const parse = z.safeParse(schemas.sessionIdResponse, data)
		if( !parse.success ) {
			throw new Error('Fel format på svar från servern.\n' + JSON.stringify(data))
		}

		const session: TeacherSession = {
			uid: s.uid,
			sid: parse.data.sid,  // session id from server
			isTeacher: true,
			connectedCount: 0,
			lostCount: 0,
			messages: []
		}
		set(session)

	} catch(error) {
		console.log(`Kunde inte skapa ny lärarsession: ${getErrorMessage(error)}`)
		return
	}
}


export async function closeSession(s: Session, set: ReactSet<Session>) {
	console.log(`manage session close 1`)
	if( !s.isTeacher ) return

	try {
		console.log(`manage session close 2`)
		const response = await api(`/api/session/${s.sid}`, {
			method: 'DELETE'
		})
		console.log(`manage session close 3`, response.status)
		if( response.status !== 204 ) {
			console.log(`Error when closing session: ${response.status}.`)
			return
		}
		set({
			isTeacher: false,  // hack to show "start" button
			uid: s.uid,
			sid: ''
			//  connectedCount: 0, lostCount: 0, messages: []
		})
	}
	catch(error) {
		console.log(`Error when closing session: ${getErrorMessage(error)}.`)
	}
}


export async function openQuestion(sid: string): Promise<boolean> {
	try {
		const response = await api(`/api/question/t/${sid}`, {
			method: 'POST'
		})
		if( response.status !== 204 ) console.log(`Fel vid öppnande av fråga: ${response.status}`)
		return true
	}
	catch(error) {
		console.log(`Kunde inte sätta igång fråga: ${getErrorMessage(error)}`, )
	}
	return false
}


export async function closeQuestion(sid: string): Promise<boolean> {
	try {
		const response = await api(`/api/question/t/${sid}`, {
			method: 'DELETE'
		})
		if( response.status !== 204 ) console.log(`Fel vid stängning av fråga: ${response.status}`)
			return true
	} catch(error) {
		console.log(`Kunde inte stänga fråga: ${getErrorMessage(error)}`, )
	}
	return false
}


export async function answerQuestion(sid: string, value: number, uid: string): Promise<boolean> {
	console.log('SENDING STUDENT ANSWER', sid, value, uid)
	try {
		const response = await api(`/api/question/s/${sid}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ uid, value })
		})
		console.log(`En student svarade på frågan. Status: ${response.status}`)
		return true
	} catch(error) {
		console.log(`Kunde inte svara på fråga: ${getErrorMessage(error)}`, )
	}
	return false
}


export async function teacherPoll(sid: string): Promise<TeacherPollResponse | null> {
	try {
		const response = await api(`/api/poll/t/${sid}`)
		const data = await response.json()
		const parsed = z.safeParse(schemas.teacherPollResponse, data)
		// console.log(`api-f teacher poll amnswers`, parsed.data?.answers)
		if( !parsed.success ) {
			console.log(`Parse error`, parsed.error)
			throw new Error('Parse error')
		}
		return parsed.data

	} catch(error) {
		console.log(`Teacher poll error: `, getErrorMessage(error))
	}
	return null
}


export async function studentPoll(sid: string): Promise<StudentPollResponse | null> {
	try {
		// if( !sid ) { console.log(`student poll SID FALSY`, sid)}
		// console.log(`api studentpoll sid=${sid}`)
		const response = await api(`/api/poll/s/${sid}`)
		const data = await response.json()
		const parsed = z.safeParse(schemas.studentPollResponse, data)
		console.log(`Student poll, data received: `, data.code)
		if( !parsed.success ) {
			console.log(`Parse error`, parsed.error)
			throw new Error('Parse error')
		}
		return parsed.data

	} catch(error) {
		console.log(`Teacher poll error: `, getErrorMessage(error))
	}
	return null
}

// POST /teacher
// regga ny session
// (kolla om det finns gamla sessions typ >24 timmar som kan tas bort)

// DELETE /teacher/:id
// avsluta session

// POST /question
// sätt igång en ny fråga

// DELETE /question
// stoppa fråga




// POST /student { id, alias }
// regga sig på en session

// GET /question/:sessionId
// pågår det någon fråga just nu?

// DELETE /student/:id
// avregga student

// PUT /question
// regga studentens röst (man kan ändra sin röst)
