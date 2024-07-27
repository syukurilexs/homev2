import { Action } from './action.type';
import { DeviceCommon } from './device-common.type';

export type Light = DeviceCommon & {
  selectedAction: Action[];
};
