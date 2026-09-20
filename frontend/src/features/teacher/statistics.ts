import type { Question, QuestionResponse } from "../../data/types"

type Result = {
	average: number; values: number; skips: number; max: number; min: number;
}

export function useStatistics(q: Question): Result {
	let average = NaN, values = 0, skips = 0, max = NaN, min = NaN
	// TODO: vilken statistik vill vi visa?
	// Eftersom studenterna drar en markör på en skala när de röstar, kommer vi få decimala värden.
	// medel, max, min, antal röster

	// Status kan vara: unstarted, active, ended
	if( q.status === 'unstarted' ) return { average, values, skips, max, min }

	const scores: number[] = q.responses.map(r => extractScore(r))
	const actualScores = scores.filter(s => !isNaN(s))
	values = actualScores.length
	skips = scores.length - actualScores.length

	actualScores.forEach(s => {
		if( isNaN(min) ) {
			min = s
			max = s
			return
		}
		if( s < min ) min = s
		if( s > max ) max = s
	})
	if( actualScores.length > 0 ) average = max / actualScores.length

	return { average, values, skips, max, min }
}

function extractScore(qr: QuestionResponse): number {
	if( qr.data.status === "answered" )
		return qr.data.answer
	return NaN
}
