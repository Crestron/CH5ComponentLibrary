import { ElogLevel } from '../enums';

export type TLog = {
  message: string;
  level: ElogLevel;
  date: Date;
};
