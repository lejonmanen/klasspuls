import { useStore } from "../../data/store"
import type { Question, Session } from "../../data/types"
import { calcStatistics } from "../../data/statistics"
import { closeQuestion, openQuestion, teacherPoll } from "../../data/api-f"
import { useEffect, useState } from "react"
import type { TeacherPollResponse } from "../../../../packages/shared/types"


const pollInterval = 3000

const RealtimeResults = () => {
	const s: Session = useStore(state => state.session)
	const q: Question = useStore(state => state.question)
	const setQ = useStore(state => state.setQuestion)
	const [poll, setPoll] = useState<TeacherPollResponse>({
		code: 200,
		message: '',
		questionActive: false,
		participants: [],
		answers: []
	})
	const isTeacher = s.isTeacher

	useEffect(() => {
		console.log(`realtime results useEffect`, s)
		const iid = setInterval(async () => {
			if( !s.isTeacher ) {
				clearInterval(iid)
				console.log(`** Cleared interval`)
				return
			}
			const maybe: TeacherPollResponse | null = await teacherPoll(s.sid)
			if( !maybe ) {
				console.log(`Poll failed with error`)
				clearInterval(iid)
				return
			}
			setPoll(maybe)
			console.log(`** Polling`)//, maybe)
		}, pollInterval);

		return () => clearInterval(iid)  // Unregister intervals
	}, [isTeacher])

	if( !s.isTeacher ) return null

	const handleOpen = async () => {
		if( !(await openQuestion(s.sid)) ) {
			return
		}
		setQ({
			status: "active", responses: []
		})
	}
	const handleClose = async () => {
		if( q.status !== "active" ) return

		if( !(await closeQuestion(s.sid)) ) {
			return
		}

		setQ({
			status: 'ended',
			responses: [ ...q.responses],
			timeAsked: new Date()
		})
	}

	const { average, valueCount, skips, max, min } = calcStatistics(poll, q.status)
	// console.log('RealtimeResults: ', average, valueCount, skips, max, min)
	// Poll results are in "poll" and "q"
	// poll: code, message, questionActive, participants, answers
	// q: responses, status

	return (
		<div className="results">
			<p> Aktiva studenter: {s.connectedCount} </p>

			{['unstarted', 'ended'].includes(q.status) &&
				<button onClick={handleOpen} className="btn"> Ta pulsen på klassen </button>
			}
			{q.status === "active" &&
				<button onClick={handleClose} className="btn"> Stäng fråga </button>
			}

			{q.status !== "unstarted" && (
				<div>
					<p> {poll.answers.length} svar ({poll.participants.length} återstår) </p>
					{poll.answers.length > 0 && (
						<p> Medel: {average} </p>
					)}

					{/* TODO: diagram */}
				</div>
			)}

			{/* <p> Meddelanden. Studenter som joinar/lämnar, tappad kommunikation osv. </p> */}
		</div>
	)
}

export default RealtimeResults
