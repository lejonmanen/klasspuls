import * as z from 'zod'
import { useStore } from "../../data/store"
import type { Session, TeacherSession } from "../../data/types"
import { getErrorMessage } from "../../data/utils"
import { schemas } from '../../../../packages/shared/types.ts'

type Props = {}

const ManageSession = ({  }: Props) => {
	const s: Session = useStore(state => state.session)
	const set = useStore(state => state.setSession)

	const handleNewSession = async () => {
		try {
			const response = await fetch('/api/session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ uid: s.uid })
			})

			const data: unknown = await response.json()
			const parse = z.safeParse(schemas.sessionIdResponse, data)
			if( !parse.success ) {
				throw new Error('Fel format på svar från servern.\n' + JSON.stringify(data))
			}

			const session: TeacherSession = {
				uid: s.uid,
				sid: parse.data.sid,  // session id from server
				isTeacher: true,
				connectedCount: 0,
				lostCount: 0,
				messages: []
			}
			set(session)

		} catch(error) {
			console.log(`Kunde inte skapa ny lärarsession: ${getErrorMessage(error)}`)
			return
		}
	}

	const handleCloseSession = async () => {
		console.log(`manage session close 1`)
		if( !s.isTeacher ) return

		try {
			console.log(`manage session close 2`)
			const response = await fetch(`/api/session/${s.sid}`, {
				method: 'DELETE'
			})
			console.log(`manage session close 3`, response.status)
			if( response.status !== 204 ) {
				console.log(`Error when closing session: ${response.status}.`)
				return
			}
			set({
				isTeacher: false,  // hack to show "start" button
				uid: s.uid,
				sid: ''
				//  connectedCount: 0, lostCount: 0, messages: []
			})
		}
		catch(error) {
			console.log(`Error when closing session: ${getErrorMessage(error)}.`)
		}
	}

	return (
		<div className="manage-session">
			{/* Före: visa kontroller för att starta session. När den är igång visas "avsluta" */}

			{s.isTeacher ? (
				<div className="column">
					<button className="btn" onClick={handleCloseSession}> Avsluta session </button>

					<p> Pågående session: <code> {s.sid} </code> </p>
					{/* {s.uid && <Link to={'/code/' + s.sid} className="btn" target="_blank"> Visa kod <ExternalLink /> </Link> } */}
				</div>
			) : (
				<button className="btn" onClick={handleNewSession}> Starta ny session </button>
			)}


		</div>
	)
}

export default ManageSession
