import { NextFunction, Response } from "express";

import { IRequest, ResponseSender } from "../../utils/rest";
import ProjectsService from "./service";
import ProjectValidator from "./validator";

let callbackUrl = "";

export default class ProjectsController {
  validator: ProjectValidator;
  service: ProjectsService;

  constructor() {
    this.validator = new ProjectValidator();
    this.service = new ProjectsService();
  }

  async create(
    req: IRequest<{
      title: string;
      project: string;
      thumbnail?: string;
    }>,
    res: Response,
    next: NextFunction
  ) {
    const validationResult = this.validator.create(req.body);

    const response = new ResponseSender(res);

    if (validationResult.error) {
      console.log("Bad request: ", validationResult.error);
      return response.send400({
        message: validationResult.error.message,
      });
    }
    const result = await this.service.createProject({
      ...req.body,
      ownerId: req.user!.user!.id,
    });

    if (result && result.error) {
      return response.send({
        status: result.error.status,
        message: result.error.message,
      });
    }

    if (result && result.project) {
      return response.send201({
        message: "Project created",
        data: result.project,
      });
    }
  }

  async retrieveAll(req: IRequest<{}>, res: Response, next: NextFunction) {
    const response = new ResponseSender(res);

    const result = await this.service.retrieveAll({
      userId: req.user!.user!.id,
    });

    if (result && result.error) {
      return response.send({
        status: result.error.status,
        message: result.error.message,
      });
    }

    if (result && result.projects) {
      return response.send({
        message: "Projects retrieved",
        data: result.projects,
      });
    }
  }

  async addToCollection(req: IRequest<{ collectionId: string }>, res: Response, next: NextFunction) {
    const response = new ResponseSender(res);
    const result = await this.service.addToCollection({
      collectionId: parseInt(req.body.collectionId),
      projectId: parseInt(req.params.id),
    });

    if (result && result.error) {
      return response.send({
        status: result.error.status,
        message: result.error.message,
      });
    }

    if (result && result.projects) {
      return response.send({
        message: "Project added to collection",
        data: result.projects,
      });
    }
  }

  async removeFromCollection(req: IRequest<{}>, res: Response, next: NextFunction) {
    const response = new ResponseSender(res);

    const result = await this.service.removeFromCollection({
      projectId: parseInt(req.params.id),
    });

    if (result && result.error) {
      return response.send({
        status: result.error.status,
        message: result.error.message,
      });
    }

    if (result && result.projects) {
      return response.send({
        message: "Project removed from collection",
        data: result.projects,
      });
    }
  }

  async retrieveOne(
    req: IRequest<{
      id: string;
    }>,
    res: Response,
    next: NextFunction
  ) {
    const response = new ResponseSender(res);

    const result = await this.service.retrieveOne({
      projectId: parseInt(req.params.id),
    });

    if (result && result.error) {
      return response.send({
        status: result.error.status,
        message: result.error.message,
      });
    }

    if (result && result.project) {
      return response.send({
        message: "Project retrieved",
        data: result.project,
      });
    }
  }
  async removeOne(
    req: IRequest<{
      id: string;
    }>,
    res: Response,
    next: NextFunction
  ) {
    const response = new ResponseSender(res);

    const result = await this.service.removeOne({
      projectId: parseInt(req.params.id),
    });

    if (result && result.error) {
      return response.send({
        status: result.error.status,
        message: result.error.message,
      });
    }

    return response.send({
      message: "Project retrieved",
    });
  }

  async addItem(
    req: IRequest<{
      newItem: any;
    }>,
    res: Response,
    next: NextFunction
  ) {
    const response = new ResponseSender(res);

    const projectId = parseInt(req.params.id);

    const newItem = req.body.newItem;

    if (newItem) {
      const { project } = await this.service.addItem({
        projectId,
        newItem,
      });

      return response.send({
        message: "success update",
        data: { project },
      });
    }

    response.send400({});
  }

  async updateItem(
    req: IRequest<{
      updatedObject: any;
    }>,
    res: Response,
    next: NextFunction
  ) {
    const response = new ResponseSender(res);

    const projectId = parseInt(req.params.id);

    const updatedObject = req.body.updatedObject;

    if (updatedObject) {
      const { project } = await this.service.updateItem({
        projectId,
        updatedObject,
      });

      return response.send({
        message: "success update",
        data: { project },
      });
    }

    response.send400({});
  }
}
