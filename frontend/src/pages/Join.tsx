import { useNavigate, useParams } from "react-router"
import { useStore } from "../data/store";
import type { StudentSession } from "../data/types";
import { useEffect, useState } from "react";

type ExpectCode = { code: string; }
type Form = { code: string; alias: string; }

const Join = () => {
	const set: (x: StudentSession) => void = useStore(state => state.setSession)
	const params = useParams<ExpectCode>()
	const nav = useNavigate()
	const [form, setForm] = useState<Form>({ code: '', alias: '' })

	useEffect(() => {
		if( params.code ) {
			set({ id: params.code, isTeacher: false
			})
			nav(`/s`)
		}
	}, [params])

	const handleJoin = async () => {
		set({ id: form.code, isTeacher: false, alias: form.alias })
		nav('/s')
		// TODO server, register this student
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
					onChange={e => setForm({ ...form, code: e.target.value })}
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
