import { Action } from './action.type';
import { DeviceCommon } from './device-common.type';

export type Suis = DeviceCommon & {
  action: Action[];
};
