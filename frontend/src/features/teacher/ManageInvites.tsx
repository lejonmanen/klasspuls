import { ClipboardList } from "lucide-react"
import { useStore } from "../../data/store"
import type { Session } from "../../data/types"

const ManageInvites = () => {
	const session: Session = useStore(state => state.session)
	// TODO direct link to session does not work - check React Router
	const joinPath = 'https://forverkliga.se/app/klasspuls/join'
	// const path = 'https://forverkliga.se/app/klasspuls'
	const code = session.isTeacher ? session.sid : null
	// const url = code ? `${path}/s/${code}` : 'Ingen session'

	const handleCopy = async () => {
		await navigator.clipboard.writeText(joinPath)
	}
	if( !code ) return null

	return (
		<div className="manage-invites">
			{code && (
			<p className="row">
				Dela länk till studenter:
				<code> {joinPath} </code>
				<button title="Kopiera" className="btn icon" onClick={handleCopy}> <ClipboardList /> </button>
			</p>
			)}

		</div>
	)
}

export default ManageInvites
