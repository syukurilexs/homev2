import { StateE } from '../enums/state.enum';
import { DeviceCommon } from './device-common.type';

export type Rpi = DeviceCommon & {
  on: string;
  off: string;
};
