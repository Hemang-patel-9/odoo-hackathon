export interface Answer {
    _id: string
    content: string
    author: {
        _id: string
        name: string
        avatar?: string
    }
    acceptedAnswer:boolean
    votes: string[]
    createdAt: string
    updatedAt: string
}
