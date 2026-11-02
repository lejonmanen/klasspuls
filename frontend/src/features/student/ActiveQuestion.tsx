import { useState } from "react"
import { answerQuestion } from "../../data/api-f"
import { useStore } from "../../data/store"
import type { QuestionS } from "../../data/types"
import Slider from "../slider/Slider"

type Props = { q: QuestionS }

const ActiveQuestion = ({ q }: Props) => {
	const uid = useStore(state => state.session.uid)
	const sid = useStore(state => state.session.sid)
	const [vote, setVote] = useState<number>(-1)
	if( q !== "active" ) return null  // bara för TypeScript

	const handleAnswer = async () => {
		await answerQuestion(sid, vote, uid)
	}
	const onChange = (value: number) => setVote( Math.round(value*100)/100 )

	return (
		<div className="active-question">
			<Slider onChange={onChange} />

			<button
				className="answer-button btn"
				onClick={handleAnswer}
				disabled={vote === -1}
			> Svara! </button>

			<p> Du kan ändra ditt svar genom att skicka igen. </p>
		</div>
	)
}

export default ActiveQuestion
