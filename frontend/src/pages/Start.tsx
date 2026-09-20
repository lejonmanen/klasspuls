import { Link } from "react-router"

type Props = {}

const Start = ({  }: Props) => {

	return (
		<div className="start-view">
			<p> Välkommen till klasspuls! </p>
			<p> Är du här som lärare eller student? </p>

			<div className="row">
				<Link to="/t" className="btn big-button"> Lärare </Link>
				<Link to="/s" className="btn big-button"> Student </Link>
			</div>
		</div>
	)
}

export default Start
