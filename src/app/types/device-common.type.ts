import { DeviceE } from '../enums/device-type.enum';

export interface DeviceCommon {
  id: number;
  name: string;
  type: DeviceE;
  remark: string;
}
