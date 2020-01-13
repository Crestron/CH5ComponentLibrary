import { AbstractController } from './AbstractController';
import { JsonController, Get, Req, Res, Post, Body } from 'routing-controllers';
import { Response, Request } from 'express-serve-static-core';
import { Filter } from '../model/Filter';
import { WebSocket } from '../WebSocket';

@JsonController()
export class ConfigurationController extends AbstractController {

  protected filterModel: Filter = new Filter();

  constructor() {
    super();
  }

  @Get('/configuration')
  public index(@Req() req: Request, @Res() res: Response) {
    return this.filterModel;
  }

  @Post('/configuration')
  public async save(@Body() body: {[key:string]: any}, @Req() request: Request) {

    const { level, source, regularExpression } = body;
    this.filterModel = new Filter(level, source, regularExpression);

    const websocket = WebSocket.getInstance();

    websocket.broadcast({
      filter: { ...this.filterModel },
    });

    return this.filterModel;
  }
}
