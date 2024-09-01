import { DeviceE } from '../enums/device-type.enum';

export interface DeviceCommon {
  id: number;
  name: string;
  topic: string; // To remove soon
  type: DeviceE;
  remark: string;
}
