import { StateE } from '../enums/state.enum';
import { Action } from './action.type';
import { DeviceActuator } from './device-actuator.type';
import { DeviceCommon } from './device-common.type';

export type Light = DeviceCommon & {
  topic: string;
  state: StateE;
  actions: Action[];
  deviceActuator: DeviceActuator;
};
