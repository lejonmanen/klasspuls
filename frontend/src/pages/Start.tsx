import { Link } from "react-router"

type Props = {}

const Start = ({  }: Props) => {

	return (
		<div className="start-view">
			<p> Välkommen till klasspuls! </p>
			<p> Är du här som lärare eller student? </p>

			<Link to="/t"> Lärare </Link>
			<Link to="/s"> Student </Link>
		</div>
	)
}

export default Start
