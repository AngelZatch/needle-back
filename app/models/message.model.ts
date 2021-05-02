export class Message {
    author!: number;
    content!: string;
    createdAt?: Date;

    constructor(author: number, content: string) {
        this.author = author;
        this.content = content;
    }
}