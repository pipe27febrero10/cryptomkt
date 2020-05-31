export class UserException extends Error{
    name : string;
    message : string;
    stack : string;
    constructor(name : string,message : string,stack : string){
        super()
        this.name = name
        this.message = message
        this.stack = stack
    }
}
