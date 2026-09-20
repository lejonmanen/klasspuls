// Generate id
const cons = 'BCDFGHJKLMNPQRSTVWXYZ'.split('')
const vow  = 'AEIOUY'.split('')
const digit= [1,2,3,4,5,6,7,8,9,0].map(d => String(d))

export function generateId(): string {

	return pick(cons) + pick(vow) + pick(cons) + pick(digit,2)
}

function pick(array: string[], count: number = 1): string {
	let xs = ''
	for( let i=0; i<count; i++ ) {
		xs += array[Math.floor(Math.random() * array.length)]
	}
	return xs
}

// ----------------------------------------------------

/**
 * score är ett värde mellan 1-5
 */
export function displayScore(n: number): string {
	// Avrunda till två decimaler
	return (Math.round(n * 100) / 100).toFixed(2)
}

