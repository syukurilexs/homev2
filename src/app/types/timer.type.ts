import { OptionE } from '../enums/option.enum';
import { StateE } from '../enums/state.enum';

export interface Timer {
  createdAt: string;
  updatedAt: string;
  id: number;
  state: StateE;
  option: OptionE;
  time: string;
}
