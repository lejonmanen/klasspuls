import React, { useRef, useState } from 'react'
import type { PointerEvent } from 'react';
import './Slider.css'

type Props = {
	onChange: (v: number) => void;
}

// Slider code buy Claude
// LATER: refactor stuff into separate files this is too much logic in component

const clamp = (v: number) => Math.min(1, Math.max(0, v));


const Slider = ({ onChange }: Props) => {
	const [isGrabbed, setIsGrabbed] = useState<boolean>(false)
	const [position, setPosition] = useState<number>(0)
	const innerRef = useRef<HTMLDivElement>(null)
	const moverRef = useRef<HTMLDivElement>(null)
	const grabOffset = useRef<number>(0)

	const commit = (next: number) => {
		const v = clamp(next)
		// console.log(`slider.commit `, next, v)
		setPosition(v)
		onChange(v)
	}

	const valueFromPointer = (clientX: number) => {
		// console.log(`slider.value from pointer`)
		const inner = innerRef.current
		const mover = moverRef.current
		if( !inner || !mover ) return position

		const rect = inner.getBoundingClientRect()
		const usable = rect.width - mover.offsetWidth
		if (usable <= 0) return position

		return clamp((clientX - rect.left - grabOffset.current) / usable)
	}

	const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
		// console.log(`slider.handlepointerdown`)
		// if (e.button !== 0) return // bara vänster musknapp / touch / penna
		const mover = moverRef.current
		if (!mover) return

		const onMover = mover.contains(e.target as Node)
		if (onMover) {
			grabOffset.current = e.clientX - mover.getBoundingClientRect().left
		} else {
			// Klick på banan: centrera movern under pekaren och börja dra därifrån.
			grabOffset.current = mover.offsetWidth / 2;
			commit(valueFromPointer(e.clientX))
		}

		// Alla pointer-events för den här pekaren hamnar nu hos .inner,
		// även när pekaren lämnar elementet eller fönstret.
		e.currentTarget.setPointerCapture(e.pointerId)
		setIsGrabbed(true)
		e.preventDefault() // hindrar textmarkering vid dragning
	};

	const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
		// console.log(`slider.handlepointermove`, isGrabbed)
		if( !isGrabbed ) return
		commit(valueFromPointer(e.clientX))
	}

	const endDrag = () => setIsGrabbed(false)


	return (
		<div className="slider">

			<div className="above">
				<div> 😵‍💫 </div>
				<div> 🤔 </div>
				<div> 🤓 </div>
			</div>

			<div className="inner"
				ref={innerRef}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				onLostPointerCapture={endDrag}
			>
				<div className={"mover" + (isGrabbed ? ' grabbed' : '')}
					ref={moverRef}
					style={{ "--value": position } as React.CSSProperties}
					role="slider"
					tabIndex={0}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(position * 100)}
					aria-orientation="horizontal"
				> </div>
			</div>

			<div className="below">
				<div> Fattar noll </div>
				<div> Solklart </div>
			</div>
		</div>
	)
}

export default Slider
