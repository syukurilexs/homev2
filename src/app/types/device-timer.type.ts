import { Device } from './device.type';
import { Timer } from './timer.type';

export type DeviceTimer = Device & {
  timers: Timer[];
};
