import type { Question } from "../../data/types"

type Props = { q: Question }

const ActiveQuestion = ({ q }: Props) => {
	if( q.status !== "active" ) return null  // bara för TypeScript

	// TODO really cool slider!
	return (
		<div className="active-question">
			active q:
			{String(q.responses)}
		</div>
	)
}

export default ActiveQuestion
