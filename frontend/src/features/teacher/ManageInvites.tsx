import { ClipboardList } from "lucide-react"
import { useStore } from "../../data/store"

const ManageInvites = () => {
	const code = useStore(state => state.session).id

	const handleCopy = async () => {
		// TODO lägg in rätt URL här
		const url = `https://path-to-app/s/${code}`
		await navigator.clipboard.writeText(url)
	}
	if( !code ) return null

	return (
		<div className="manage-invites">
			<p className="row">
				Dela länk till studenter:
				<code> https://bla bla bla </code>
				<button title="Kopiera" className="btn icon" onClick={handleCopy}> <ClipboardList /> </button>
			</p>

		</div>
	)
}

export default ManageInvites
