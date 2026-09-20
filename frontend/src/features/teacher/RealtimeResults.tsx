import { useStore } from "../../data/store"
import type { Question, Session } from "../../data/types"
import { useStatistics } from "./statistics"


const RealtimeResults = () => {
	const s: Session = useStore(state => state.session)
	const q: Question = useStore(state => state.question)
	const setQ = useStore(state => state.setQuestion)

	if( !s.isTeacher ) return null

	const handleOpen = () => {
		// TODO server, request open question
		setQ({
			status: "active", responses: []
		})
	}
	const handleClose = () => {
		// TODO server, request close question
		if( q.status !== "active" ) return
		setQ({
			status: 'ended',
			responses: [ ...q.responses],
			timeAsked: new Date()
		})
	}

	const { average, values, skips, max, min } = useStatistics(q)
	console.log('RealtimeResults: ', average, values, skips, max, min)

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
					<p> Antal svar: {q.responses.length} ({s.connectedCount - q.responses.length} återstår) </p>
					<p> Medel: {average} </p>
					{/* TODO: diagram */}
				</div>
			)}

			<p> Meddelanden. Studenter som joinar/lämnar, tappad kommunikation osv. </p>
		</div>
	)
}

export default RealtimeResults
