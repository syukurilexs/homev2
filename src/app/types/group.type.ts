import { DeviceOld } from './device-old.type';

export type Group = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  id: number;
  devices: DeviceOld[];
};
