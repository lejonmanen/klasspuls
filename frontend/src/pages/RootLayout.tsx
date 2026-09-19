import { NavLink, Outlet } from "react-router"
import '../App.css'
// import ekg from '../public/ekg.png'

type Props = {}

const Root = ({  }: Props) => {
	return (
		<>
			<header>
				<h1>
					{/* TODO fixa till ekg-hjärtat */}
					<NavLink to="/"> Klasspuls </NavLink>
					<img src="/ekg.png" />
				</h1>
				<nav>
					<NavLink to="/t"> Lärare </NavLink>
					<NavLink to="/s"> Student </NavLink>
					<NavLink to="/join/123"> Join test </NavLink>
				</nav>
			</header>
			<main>
				<Outlet />

				{/* TODO: ta bort färgprover */}
				{/* <div className="a1"> 123 </div>
				<div className="a2"> 123 </div>
				<div className="a3"> 123 </div>
				<div className="a4"> 123 </div>
				<div className="a5"> 123 </div>
				<div className="a6"> 123 </div> */}
			</main>
			<footer>
				<a href="https://www.flaticon.com/free-icons/brain" title="brain icons">Brain icons created by Magnific - Flaticon</a>
				<a href="https://www.flaticon.com/free-icons/ekg" title="EKG icons">EKG icons created by Carlos Ivan - Flaticon</a>
			</footer>
		</>
	)
}

export default Root
