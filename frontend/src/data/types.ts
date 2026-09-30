
export type TeacherSession = {
	isTeacher: true;
	sid: string;
	uid: string;
	connectedCount: number;  // levande anslutningar
	lostCount: number;  // tappat anslutning
	messages: string[];
}
export type StudentSession = {
	isTeacher: false;
	sid: string;
	uid: string;
	alias?: string;
}
export type Session = TeacherSession | StudentSession;

// export type StudentAnonymous = { id: string; }
// export type StudentAccount = { id: string; alias: string; }


export type QuestionS = 'unstarted' | 'active' | 'ended'

export type Question =
	| {
		status: 'unstarted';
	}
	| {
		status: 'active';
		responses: QuestionResponse[];
	}
	| {
		status: 'ended';
		responses: QuestionResponse[];
		timeAsked: Date;
	}

export type QuestionResponse = {
	studentId: string;
	data: AnswerStatus;
}

export type HistoryQuestion = {
	timeAsked: Date;
	responses: QuestionResponse[];
}

// export type QuestionResponseA = {
// 	anonymous: true;
// 	status: AnswerStatus;
// }
type AnswerStatus =
	| { status: 'pending'; }
	| { status: 'answered'; answer: number; }
	| { status: 'skipped'; };


