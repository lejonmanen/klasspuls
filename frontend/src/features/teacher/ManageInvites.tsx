import { ClipboardList } from "lucide-react"
import { useStore } from "../../data/store"

const ManageInvites = () => {
	const code = useStore(state => state.session).uid
	// TODO make backend serve frontend so this works
	const localPath = 'http://localhost:3005'
	// const localPath = ''
	const url = `${localPath}/s/${code}`

	const handleCopy = async () => {
		await navigator.clipboard.writeText(url)
	}
	if( !code ) return null

	return (
		<div className="manage-invites">
			<p className="row">
				Dela länk till studenter:
				<code> {url} </code>
				<button title="Kopiera" className="btn icon" onClick={handleCopy}> <ClipboardList /> </button>
			</p>

		</div>
	)
}

export default ManageInvites
