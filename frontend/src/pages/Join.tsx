import { useNavigate, useParams } from "react-router"
import { useStore } from "../data/store";
import type { StudentSession } from "../data/types";
import { useEffect, useState } from "react";
import { generateId } from "../data/utils";

type ExpectCode = { code: string; }
type Form = { code: string; alias: string; }

const Join = () => {
	const set: (x: StudentSession) => void = useStore(state => state.setSession)
	const params = useParams<ExpectCode>()
	const nav = useNavigate()
	const [form, setForm] = useState<Form>({ code: '', alias: '' })

	useEffect(() => {
		if( params.code ) {
			// Om route innehåller "code" använd den som session id
			set({ uid: generateId(), isTeacher: false, sid: params.code
			})
			nav(`/s`)
		}
	}, [params])

	const handleJoin = async () => {
		// När vi är klara med formuläret, använd det användaren skrivit som session id
		set({ uid: generateId(), isTeacher: false, alias: form.alias, sid: form.code })
		nav('/s')
		// TODO server, register this student. Servern behöver svara med: status för eventuellt pågående fråga.
	}

	return (
		<div className="join-view">
			<p> Välkommen till Klasspuls! Skriv in lärarens kod för att ansluta. </p>
			<div className="column">
				<div className="form-item column">
				<label> Kod </label>
				<input
					type="text"
					value={form.code}
					onChange={e => setForm({ ...form, code: e.target.value.toLocaleUpperCase() })}
					/>
				</div>

				<div className="form-item column">
				<label> Alias (valfri) </label>
				<input
					type="text"
					value={form.alias}
					onChange={e => setForm({ ...form, alias: e.target.value })}
					/>
				</div>

				<button className="btn" onClick={handleJoin}> Anslut </button>
			</div>
		</div>
	)
}

export default Join
