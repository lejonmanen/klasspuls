import { useNavigate } from "react-router"
import { useStore } from "../../data/store"
import type { Question, StudentSession } from "../../data/types"
import { useEffect } from "react"

const StudentView = () => {
	// const s: StudentSession = useStore(state => state.session)
	const set: (s: StudentSession) => void = useStore(state => state.setSession)
	// const q: Question = useStore(state => state.question)


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


		</div>
	)
}

export default StudentView
