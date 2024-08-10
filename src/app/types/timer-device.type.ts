import { Device } from './device.type';
import { Timer } from './timer.type';

export type TimerDevice = Timer & {
  device: Device;
};
