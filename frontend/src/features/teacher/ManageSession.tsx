import { Link } from "react-router"
import { useStore } from "../../data/store"
import type { Session } from "../../data/types"
import { generateId } from "../../data/utils"
import { ExternalLink } from "lucide-react"

type Props = {}

const ManageSession = ({  }: Props) => {
	const s: Session = useStore(state => state.session)
	const set = useStore(state => state.setSession)

	const handleNewSession = () => {
		set({
			id: generateId(),
			isTeacher: true,
			connectedCount: 0,
			lostCount: 0,
			messages: []
		})
		// TODO: server, request new session
	}

	return (
		<div className="manage-session">
			{/* Före: visa kontroller för att starta session. När den är igång visas "avsluta" */}

			{s.isTeacher ? (
				<div className="column">
					<button className="btn" onClick={() => set({ id: '', isTeacher: false })}> Avsluta session </button>

					<p> Pågående session: <code> {s.id} </code> </p>
					{s.id && <Link to={'/code/' + s.id} className="btn" target="_blank"> Visa kod <ExternalLink /> </Link> }
				</div>
			) : (
				<button className="btn" onClick={handleNewSession}> Starta ny session </button>
			)}


		</div>
	)
}

export default ManageSession
