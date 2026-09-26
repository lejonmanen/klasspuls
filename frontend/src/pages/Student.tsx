import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import type { Session } from "../data/types"
import { useStore } from "../data/store"
import StudentView from "../features/student/StudentView"

type ExpectId = { id: string; }

const Student = () => {
	const s: Session = useStore(state => state.session)
	const params = useParams<ExpectId>()
	const nav = useNavigate()

	useEffect(() => {
		// validera session
		if( s.isTeacher ) {
			// får inte vara här om man är lärare
			nav('/t')
			return
		}
		// Om vi inte har något session id, navigera till /join
		if( !s.uid ) {
			nav('/join')
		}
	}, [s, params])

	return (
		<div className="student-view">
			{s.uid ? (
				<StudentView />
			) : (
				<p> Felaktig sessions-kod. </p>
			)}
		</div>
	)
}

export default Student
