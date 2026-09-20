import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import type { Session, StudentSession } from "../data/types"
import { useStore } from "../data/store"
import StudentView from "../features/student/StudentView"

type ExpectId = { id: string; }

const Student = () => {
	const s: Session = useStore(state => state.session)
	const set: (s: StudentSession) => void = useStore(state => state.setSession)

	const params = useParams<ExpectId>()
	const nav = useNavigate()
console.log(`Student session id`, s.id)

	useEffect(() => {
		// validera session
		if( s.isTeacher ) {
			// får inte vara här om man är lärare
			nav('/t')
			return
		}
		// Om vi inte har något session id, navigera till /join
		if( !s.id ) {
			nav('/join')
		}
	}, [s, params])

	return (
		<div className="student-view">
			{s.id ? (
				<StudentView />
			) : (
				<p> Felaktig sessions-kod. </p>
			)}
			Session id: {s.id} (DEBUG)
		</div>
	)
}

export default Student
