import { OptionE } from '../enums/option.enum';
import { StateE } from '../enums/state.enum';

export type CreateTimer = {
  deviceId: number;
  time: string;
  state: StateE;
  option: OptionE;
};

export type TimerType = {
  id: number;
  time: string;
  state: StateE;
  option: OptionE;
};
