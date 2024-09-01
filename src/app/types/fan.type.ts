import { StateE } from '../enums/state.enum';
import { Action } from './action.type';
import { DeviceActuator } from './device-actuator.type';
import { DeviceCommon } from './device-common.type';

export type FanOld = DeviceCommon & {};

export interface Fan {
  id: number;
  state: StateE;
  actions: Action[];
  topic: string;
  actuator: DeviceActuator;
}
