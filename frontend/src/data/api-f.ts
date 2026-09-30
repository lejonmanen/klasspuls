import { schemas, type StudentPollResponse, type TeacherPollResponse } from "../../../packages/shared/types"
import { getErrorMessage } from "./utils"
import * as z from 'zod'

// Kommunikation med API:et
// const useApi = () => {

// }

export async function openQuestion(sid: string): Promise<boolean> {
	try {
		const response = await fetch(`/api/question/t/${sid}`, {
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
		const response = await fetch(`/api/question/t/${sid}`, {
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
	try {
		const response = await fetch(`/api/question/s/${sid}`, {
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
		const response = await fetch(`/api/poll/t/${sid}`)
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
		const response = await fetch(`/api/poll/s/${sid}`)
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
