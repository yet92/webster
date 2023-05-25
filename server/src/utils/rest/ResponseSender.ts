import {Response, Send} from "express";

export type SendParams = {
    status?: number,
    message?: string,
    data?: any
}

export default class ResponseSender {

    private res: Response

    constructor(res: Response) {
        this.res = res;
    }

    send({status, message, data}: SendParams) {
        if (status === undefined) status = 200;
        if (status === 200 && message === undefined) {
            message = "Success";
        } else if (message === undefined) message = "";
        this.res.status(status).json({message, data});
    }

    send201({message, data}: SendParams) {
        if (message === undefined) message = 'Created';
        this.send({status: 201, message, data});
    }

    send400({message, data}: SendParams) {
        if (message === undefined) message = 'Bad request';
        this.send({status: 400, message, data});
    }

    send401({message, data}: SendParams) {
        if (message === undefined) message = 'Unauthorized';
        this.send({status: 400, message, data});
    }

    send404({message, data}: SendParams) {
        if (message === undefined) message = 'Not found';
        this.send({status: 404, message, data});
    }

    send500({message, data}: SendParams) {
        if (message === undefined) message = 'Unexpected server error';
        this.send({status: 500, message, data});
    }

}