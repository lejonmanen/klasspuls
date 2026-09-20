// TODO datatyper för kommunikationen osv.

export type TeacherSession = {
	isTeacher: true;
	id: string;
	connectedCount: number;  // levande anslutningar
	lostCount: number;  // tappat anslutning
	messages: string[];
}
export type StudentSession = {
	isTeacher: false;
	id: string;
}
export type Session = TeacherSession | StudentSession;


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


