import 'reflect-metadata';
import controllers from './controllers';
import { Bootstrap } from './Bootstrap';

const bootstrap = new Bootstrap(controllers);
bootstrap.init();
