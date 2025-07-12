// types/answer.ts

import { User } from './user.ts';

export interface Answer {
    _id: string;
    content: string;
    question: string; // or you can type this as Question if you import it
    author: User;
    votes: {
        user: string;
        vote: 1 | -1;
    }[];
    acceptedAnswer: boolean;
    createdAt: string;
    updatedAt: string;
}
