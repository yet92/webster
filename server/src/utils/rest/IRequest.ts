import {Request} from "express";

export default interface IRequest<Body> extends Request {
    body: Body
}
