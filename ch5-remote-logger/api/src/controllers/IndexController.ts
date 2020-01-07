import { AbstractController } from './AbstractController';
import { Get, Controller } from 'routing-controllers';

@Controller()
export class IndexController extends AbstractController {

  @Get('/')
  public index() {
    return 'Here is the index';
  }
}
