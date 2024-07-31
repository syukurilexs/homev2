import { DeviceE } from '../enums/device-type.enum';

export type DeviceCommon = {
  id: number;

  name: string;
  topic: string;
  type: DeviceE;
  remark: string;
};
