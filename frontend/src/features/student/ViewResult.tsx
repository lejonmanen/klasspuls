import type { Question } from "../../data/types"
import { calcStatistics } from "../../data/statistics"
import { displayScore } from "../../data/utils"

type Props = { q: Question }

const ViewResult = ({ q }: Props) => {
	const { average } = calcStatistics(q)

	// TODO: visa studentens egna svar också? visa bild i stället för text?
	return (
		<div className="view-result">
			{ isNaN(average) ? (
				<p> Läraren har avslutat frågan, men det gick inte att räkna ut något medelvärde pga inga svarande. </p>
			) : (
				<p> Läraren har avslutat frågan. Medelvärdet blev: {displayScore(average)}. </p>
			)
			}
		</div>
	)
}

export default ViewResult
