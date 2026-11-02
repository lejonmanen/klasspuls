import { NavLink, Outlet } from "react-router"
import '../App.css'
import puls from './klasspuls-header.png'

type Props = {}

const Root = ({  }: Props) => {
	return (
		<>
			<header>
				<h1>
					<img src={puls} />
					<NavLink to="/"> Klasspuls </NavLink>
				</h1>
				<nav>
					<NavLink to="/t"> Lärare </NavLink>
					<NavLink to="/s"> Student </NavLink>
					<NavLink to="/join/123"> Join test </NavLink>
				</nav>
			</header>
			<main>
				<Outlet />

			</main>
			<footer>
				<a href="https://www.flaticon.com/free-icons/brain" title="brain icons">Brain icons created by Magnific - Flaticon</a>
				<a href="https://www.flaticon.com/free-icons/ekg" title="EKG icons">EKG icons created by Carlos Ivan - Flaticon</a>
			</footer>
		</>
	)
}

export default Root
