export class OrigeenError extends Error {
    advices

    constructor(message: string, advices: string[]) {
        super(message)
        this.advices = advices
    }
}