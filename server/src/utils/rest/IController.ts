import {Router} from "express";

interface IController {

    setup: (router: Router) => void,

}

export default IController;