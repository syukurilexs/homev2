import { OptionE } from '../enums/option.enum';
import { StateE } from '../enums/state.enum';

export type UpdateTimer = {
  time?: string;
  state?: StateE;
  option?: OptionE;
};
