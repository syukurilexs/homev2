import { StateE } from '../enums/state.enum';
import { Action } from './action.type';
import { DeviceActuator } from './device-actuator.type';
import { DeviceCommon } from './device-common.type';

export type Fan = DeviceCommon & {
  state: StateE;
  actions: Action[];
  deviceActuator: DeviceActuator;
};
