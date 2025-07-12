export interface Question {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    author: {
        name: string;
        email: string;
    };
    acceptedAnswer?: string;
    votes: {
        user: string;
        vote: 1 | -1;
    }[];
    createdAt: string;
    updatedAt: string;
}