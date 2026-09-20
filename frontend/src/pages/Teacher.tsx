import ManageInvites from "../features/teacher/ManageInvites"
import ManageSession from "../features/teacher/ManageSession"
import RealtimeResults from "../features/teacher/RealtimeResults"


const Teacher = () => {

	return (
		<div className="teacher-view">
			<ManageSession />
			<ManageInvites />
			<hr />
			<RealtimeResults />
		</div>
	)
}

export default Teacher
