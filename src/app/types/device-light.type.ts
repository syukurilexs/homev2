import { DeviceCommon } from './device-common.type';
import { Light } from './light.type';

export type DeviceLight = DeviceCommon & {
  light: Light;
};
