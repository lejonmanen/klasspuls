import type { /*StudentAnswer,*/ TeacherPollResponse } from "../../../packages/shared/types";
import type { /*QuestionResponse,*/ AnswerStatus, Question, QuestionResponse, QuestionS } from "./types"

type Result = {
	average: number; valueCount: number; skips: number; max: number; min: number;
}

export function calcStatistics(poll: TeacherPollResponse, status: QuestionS): Result {
	let average = NaN, valueCount = 0, skips = 0, max = NaN, min = NaN
	// Skala: 1-5
	// TODO: vilken statistik vill vi visa?
	// Eftersom studenterna drar en markör på en skala när de röstar, kommer vi få decimala värden.
	// medel, max, min, antal röster

	// Status kan vara: unstarted, active, ended
	if( status === 'unstarted' ) return { average, valueCount, skips, max, min }

	const scores: number[] = poll.answers.map(a => a.value)
	const actualScores = scores.filter(s => !isNaN(s))
	valueCount = actualScores.length
	skips = scores.length - actualScores.length
	// console.log(`use statistics`, q, q.responses, scores, actualScores)

	let sum = 0
	actualScores.forEach(s => {
		if( isNaN(min) ) {
			min = s
			max = s
			return
		}
		sum += s
		if( s < min ) min = s
		if( s > max ) max = s
	})
	if( actualScores.length > 0 ) average = sum / actualScores.length

	return { average, valueCount, skips, max, min }
}

// function extractScore(sa: StudentAnswer): number {
// 	return sa.value
// 	if( qr.data.status === "answered" )
// 		return qr.data.answer
// 	return NaN
// }

type Calc = {
	average: number;
	answerCount: number;
	skipCount: number;
}
export function calcStudent(q: Question): Calc {
	if( q.status !== "ended" ) {
		return {average: NaN, answerCount: 0, skipCount: 0}
	}
	const f: QuestionResponse[] = q.responses.filter(r => r.data.status === "answered")
	return {
		average: asToNums(f.map(x => x.data)).reduce((cur, acc) => cur+acc, 0),
		answerCount: f.length,
		skipCount: q.responses.filter(r => r.data.status === "skipped").length
	}
}
function asToNums(a: AnswerStatus[]): number[] {
	return a.filter(x => x.status === "answered").map(y => y.answer)
}

