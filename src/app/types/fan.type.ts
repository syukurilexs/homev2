import { StateE } from '../enums/state.enum';
import { Action } from './action.type';
import { DeviceCommon } from './device-common.type';

export type FanOld = DeviceCommon & {};

export type Fan = {
  id: number;
  state: StateE;
  actions: Action[]
  topic: string;
};
