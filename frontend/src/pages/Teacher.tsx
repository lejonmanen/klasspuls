type Props = {}

const Teacher = ({  }: Props) => {

	return (
		<div className="teacher-view">
			{/* Före: visa kontroller för att starta session. När den är igång visas "avsluta" */}
			<button> Sätt igång ny session </button>
			<button> Avsluta session </button>

			{/* Hantera inbjudningar */}
			<div>
				Join-länk
				<code> https://bla bla bla </code>
				<button> Kopiera </button>
				{/* TODO lucide icon (clipboard) till knappen */}
			</div>
			<button> Visa kod-vy </button>
			{/* TODO: öppna nytt fönster där koden kan visas extra stort */}

			<hr />

			{/* Visa realtidsresultat. Före visas ta pulsen. Sedan visas stäng fråga. */}
			<p> Aktiva studenter: 12 </p>
			<button> Ta pulsen </button> --
			<button> Stäng fråga </button>
			{/* TODO: "ta pulsen" sätter igång en fråga */}
			<p> Antal svar: 5 (7 återstår) </p>
			<p> Medel: 3,75 </p>
			{/* TODO: diagram */}

			<p> Meddelanden. Studenter som joinar/lämnar, tappad kommunikation osv. </p>
		</div>
	)
}

export default Teacher
