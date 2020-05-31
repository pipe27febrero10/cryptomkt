export class LocalIndicatorException extends Error{
    name : string;
    message : string;
    stack? : string;
    constructor(name : string,message : string,stack? : string)
    {
        super(name)
        this.message = message
        this.stack = stack ? stack : this.stack 
    }
}