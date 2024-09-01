import { DeviceCommon } from './device-common.type';
import { Suis } from './suis.type';

export type DeviceSuis = DeviceCommon & {
  suis: Suis;
};
