import { answerQuestion } from "../../data/api-f"
import { useStore } from "../../data/store"
import type { QuestionS } from "../../data/types"

type Props = { q: QuestionS }

const ActiveQuestion = ({ q }: Props) => {
	const uid = useStore(state => state.session.uid)
	const sid = useStore(state => state.session.sid)
	if( q !== "active" ) return null  // bara för TypeScript

	const handleAnswer = async () => {
		await answerQuestion(sid, 3.5, uid)
	}

	// TODO really cool slider!
	return (
		<div className="active-question">
			slider plz
			{q}

			<button onClick={handleAnswer}> TEMP svara 3.5 </button>
		</div>
	)
}

export default ActiveQuestion
