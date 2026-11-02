import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import "./Slider.css";

type SliderProps = {
	/** Kontrollerat värde mellan 0 och 1. Utelämna för okontrollerat läge. */
	value?: number;
	/** Startvärde i okontrollerat läge (0–1). */
	defaultValue?: number;
	/** Anropas med nytt värde (0–1) när användaren flyttar reglaget. */
	onChange?: (value: number) => void;
};

const KEY_STEP = 0.05;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function Slider({ value, defaultValue = 0.5, onChange }: SliderProps) {
	const [internal, setInternal] = useState(defaultValue);
	const [grabbed, setGrabbed] = useState(false);

	const innerRef = useRef<HTMLDivElement>(null);
	const moverRef = useRef<HTMLDivElement>(null);
	// Avstånd mellan pekaren och movens vänsterkant när man greppade den,
	// så att movern inte "hoppar" till pekaren.
	const grabOffset = useRef(0);

	const current = value ?? internal;

	const commit = (next: number) => {
		const v = clamp(next);
		if (value === undefined) setInternal(v);
		onChange?.(v);
	};

	const valueFromPointer = (clientX: number) => {
		const inner = innerRef.current;
		const mover = moverRef.current;
		if (!inner || !mover) return current;

		const rect = inner.getBoundingClientRect();
		const usable = rect.width - mover.offsetWidth;
		if (usable <= 0) return current;

		return clamp((clientX - rect.left - grabOffset.current) / usable);
	};

	const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
		if (e.button !== 0) return; // bara vänster musknapp / touch / penna
		const mover = moverRef.current;
		if (!mover) return;

		const onMover = mover.contains(e.target as Node);
		if (onMover) {
			grabOffset.current = e.clientX - mover.getBoundingClientRect().left;
		} else {
			// Klick på banan: centrera movern under pekaren och börja dra därifrån.
			grabOffset.current = mover.offsetWidth / 2;
			commit(valueFromPointer(e.clientX));
		}

		// Alla pointer-events för den här pekaren hamnar nu hos .inner,
		// även när pekaren lämnar elementet eller fönstret.
		e.currentTarget.setPointerCapture(e.pointerId);
		setGrabbed(true);
		e.preventDefault(); // hindrar textmarkering vid dragning
	};

	const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
		if (!grabbed) return;
		commit(valueFromPointer(e.clientX));
	};

	const endDrag = () => setGrabbed(false);

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		let next: number | null = null;
		switch (e.key) {
			case "ArrowLeft":
			case "ArrowDown":
				next = current - KEY_STEP;
				break;
			case "ArrowRight":
			case "ArrowUp":
				next = current + KEY_STEP;
				break;
			case "Home":
				next = 0;
				break;
			case "End":
				next = 1;
				break;
		}
		if (next !== null) {
			e.preventDefault();
			commit(next);
		}
	};

	return (
		<div className="slider">
			<div className="above">
				<div> 🤔 </div>
				<div> 🤓 </div>
			</div>

			<div
				className={`inner${grabbed ? " grabbed" : ""}`}
				ref={innerRef}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				onLostPointerCapture={endDrag}
			>
				<div
					className={`mover${grabbed ? " grabbed" : ""}`}
					ref={moverRef}
					style={{ "--value": current } as React.CSSProperties}
					role="slider"
					tabIndex={0}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(current * 100)}
					aria-orientation="horizontal"
					onKeyDown={handleKeyDown}
				>
					{" "}
				</div>
			</div>

			<div className="below">
				<div> Fattar noll </div>
				<div> Solklart </div>
			</div>
		</div>
	);
}
