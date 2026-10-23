import { closeSession, newSession } from "../../data/api-f"
import { useStore } from "../../data/store"
import type { Session } from "../../data/types"


type Props = {}

const ManageSession = ({  }: Props) => {
	const s: Session = useStore(state => state.session)
	const set = useStore(state => state.setSession)



	return (
		<div className="manage-session">
			{/* Före: visa kontroller för att starta session. När den är igång visas "avsluta" */}

			{s.isTeacher ? (
				<div className="column">
					<button className="btn" onClick={() => closeSession(s, set)}> Avsluta session </button>

					<p> Pågående session: <code> {s.sid} </code> </p>
					{/* {s.uid && <Link to={'/code/' + s.sid} className="btn" target="_blank"> Visa kod <ExternalLink /> </Link> } */}
				</div>
			) : (
				<button className="btn" onClick={() => newSession(s, set)}> Starta ny session </button>
			)}


		</div>
	)
}

export default ManageSession
