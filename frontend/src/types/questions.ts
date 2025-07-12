export interface Question {
    _id: string
    title: string
    description: string
    tags: string[]
    author: {
        _id: string
        name: string
        avatar?: string
    }
    votes: string[]
    answers: any[]
    createdAt: string
    updatedAt: string
    answerCount: number
}

export interface User {
    id: string
    name: string
    avatar?: string
}
