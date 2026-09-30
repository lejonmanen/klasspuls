import { useNavigate } from "react-router"
import { useStore } from "../../data/store"
import type { QuestionResponse, QuestionS, Session, StudentSession } from "../../data/types"
import ActiveQuestion from "./ActiveQuestion"
import { useEffect } from "react"
import { studentPoll } from "../../data/api-f"

const pollInterval = 3000

const StudentView = () => {
	const q: QuestionS = useStore(state => state.questionS)
	const ss: Session = useStore(state => state.session)
	const set: (s: StudentSession) => void = useStore(state => state.setSession)
	const setQ: (q: QuestionS) => void = useStore(state => state.setQuestionS)

	const nav = useNavigate()

	useEffect(() => {
		if( ss.isTeacher ) return

		console.log(`student view effect startar interval`)
		const iid = setInterval(async() => {
			if( !ss.sid ) {
				console.log(`ERROR studentview interval, no session id!!`)
				return
			}
			const spr = await studentPoll(ss.sid)
			if( !spr ) return
			if( spr.questionActive && q !== 'active' ) {
				setQ('active')
			} else if( !spr.questionActive && q === 'active' ) {
				setQ('ended')
			}
		}, pollInterval)
		return () => clearInterval(iid)
	}, [])

	const handleLeave = () => {
		// TODO server, unregister student
		set({ isTeacher: false, uid: '', sid: '', alias: 'utloggad' })
		nav('/')
	}

	return (
		<div className="student-view">
			<div>
				<button className="btn" onClick={handleLeave}> Lämna sessionen </button>
			</div>

			{q === "unstarted" && (
				<p> Läraren har inte ställt någon fråga än. Vänta en stund! </p>
			)}
			{q === "active" && <ActiveQuestion q={q} />}
			{q === "ended" && (
				<>
				<p> Frågan är avslutad. </p>
				</>
			)}

			<hr />
			debug: <button onClick={() => setQ("unstarted")}> unstarted </button>
			<button onClick={() => setQ("active")}> active </button>
			<button onClick={() => setQ("ended")}> ended </button>
		</div>
	)
}
// const exampleResponses: QuestionResponse[] = [
// 	{ studentId: '32', data: { answer: 2.345, status: "answered" }},
// 	{ studentId: '33', data: { answer: 4.1, status: "answered" }},
// 	{ studentId: '34', data: { status: "skipped" }}
// ]

export default StudentView
