import { redirect } from "react-router"
import Join from "./pages/Join.tsx"
import Root from "./pages/RootLayout.tsx"
import Start from "./pages/Start.tsx"
import Student from "./pages/Student.tsx"
import Teacher from "./pages/Teacher.tsx"
import ViewCode from "./pages/ViewCode.tsx"

export const routes = [
	{
		path: '/',
		Component: Root,
		children: [
			{
				path: '/',
				Component: Start
			},
			{
				path: '/s',
				Component: Student
			},
			{
				path: '/t',
				Component: Teacher
			},
			{
				path: '/join/:code?',
				Component: Join
			},
			{
				path: '/view/:code',
				Component: ViewCode
			},

			{
				path: '*',
				loader: () => redirect('/')
			}
		]
	}
]
