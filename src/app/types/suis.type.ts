import { Action } from './action.type';
import { DeviceCommon } from './device-common.type';

export interface Suis {
  id: number;
  topic: string;
  actions: Action[];
  device?: DeviceCommon;
}
