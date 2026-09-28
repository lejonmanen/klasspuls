import { ClipboardList } from "lucide-react"
import { useStore } from "../../data/store"
import type { Session } from "../../data/types"

const ManageInvites = () => {
	const session: Session = useStore(state => state.session)
	// TODO make backend serve frontend so this works
	const localPath = 'http://localhost:3005'
	// const localPath = ''
	const code = session.isTeacher ? session.sid : null
	const url = code ? `${localPath}/s/${code}` : 'Ingen session'

	const handleCopy = async () => {
		await navigator.clipboard.writeText(url)
	}
	if( !code ) return null

	return (
		<div className="manage-invites">
			{code && (
			<p className="row">
				Dela länk till studenter:
				<code> {url} </code>
				<button title="Kopiera" className="btn icon" onClick={handleCopy}> <ClipboardList /> </button>
			</p>
			)}

		</div>
	)
}

export default ManageInvites
