import { create } from 'zustand'
import type { HistoryQuestion, Question, QuestionS, Session } from './types.ts'
import { generateId } from './utils.ts';

type Store = {
	session: Session;
	question: Question;
	questionS: QuestionS;
	answerHistory: HistoryQuestion[];
	// account: StudentAnonymous | StudentAccount;

	setSession: (x: Session) => void;
	setQuestion: (q: Question) => void;
	setQuestionS: (q: QuestionS) => void;
}

const useStore = create<Store>(set => ({

	session: {
		isTeacher: false,
		uid: generateId(),
		sid: ''
	},
	question: {
		status: 'unstarted'
	},
	questionS: 'unstarted',
	answerHistory: [],
	// account: { id: '' },

	setSession: newSession => set({
		session: { ...newSession }
	}),
	setQuestion: newQuestion => set({
		question: { ...newQuestion }
	}),
	setQuestionS: q => set({
		questionS: q
	}),
	// TODO store, add to history

}))

export { useStore }
