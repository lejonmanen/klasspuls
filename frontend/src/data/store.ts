import { create } from 'zustand'
import type { HistoryQuestion, Question, Session } from './types.ts'

type Store = {
	session: Session;
	question: Question;
	answerHistory: HistoryQuestion[];

	setSession: (x: Session) => void;
	setQuestion: (q: Question) => void;
}

const useStore = create<Store>(set => ({

	session: {
		isTeacher: false,
		id: ''
	},
	question: {
		status: 'unstarted'
	},
	answerHistory: [],

	setSession: newSession => set({
		session: { ...newSession }
	}),
	setQuestion: newQuestion => set({
		question: { ...newQuestion }
	}),
	// TODO store, add to history

}))

export { useStore }
