import { Actuator } from './actuator.type';
import { DeviceCommon } from './device-common.type';

export type DeviceActuator = DeviceCommon & {
  actuator: Actuator;
};
