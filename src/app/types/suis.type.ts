import { Action } from './action.type';
import { DeviceCommon } from './device-common.type';
import { Device } from './device.type';

export interface Suis {
  id: number;
  topic: string;
  actions: Action[];
  device?: DeviceCommon;
}
