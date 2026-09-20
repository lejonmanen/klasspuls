import { useNavigate } from "react-router"
import { useStore } from "../../data/store"
import type { Question, QuestionResponse, StudentSession } from "../../data/types"
import ActiveQuestion from "./ActiveQuestion"
import ViewResult from "./ViewResult"

const StudentView = () => {
	const q: Question = useStore(state => state.question)
	const set: (s: StudentSession) => void = useStore(state => state.setSession)
	const setQ: (q: Question) => void = useStore(state => state.setQuestion)


	const nav = useNavigate()

	const handleLeave = () => {
		// TODO server, unregister student
		set({ isTeacher: false, id: '', alias: 'utloggad' })
		nav('/')
	}

	return (
		<div className="student-view">
			<div>
				<button className="btn" onClick={handleLeave}> Lämna sessionen </button>
			</div>

			{q.status === "unstarted" && (
				<p> Läraren har inte ställt någon fråga än. Vänta en stund! </p>
			)}
			{q.status === "active" && <ActiveQuestion q={q} />}
			{q.status === "ended" && (
				<>
				<ViewResult q={q} />
				</>
			)}

			<hr />
			debug: <button onClick={() => setQ({ ...q, status: "unstarted"})}> unstarted </button>
			<button onClick={() => setQ({ ...q, status: "active", responses: exampleResponses })}> active </button>
			<button onClick={() => setQ({ ...q, status: "ended", responses: exampleResponses, timeAsked: new Date() })}> ended </button>
		</div>
	)
}
const exampleResponses: QuestionResponse[] = [
	{ studentId: '32', data: { answer: 2.345, status: "answered" }},
	{ studentId: '33', data: { answer: 4.1, status: "answered" }},
	{ studentId: '34', data: { status: "skipped" }}
]

export default StudentView
