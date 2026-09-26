import { type RequestHandler } from 'express'

export const logger: RequestHandler = (req, res, next) => {
	const now: string = new Date().toLocaleTimeString()

	const body: string = req.body ? '+body' : '(no body)'
	console.log(`${now}  ${req.method}  ${req.url}  ${body}`)

	next()
}

