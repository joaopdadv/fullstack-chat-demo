export class Message{
    constructor(
        public id: string,
        public createdAt: Date,
        public message: string,
        public senderId:string,
        public receiverId:string
    ){}
}