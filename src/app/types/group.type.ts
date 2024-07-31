import { Device } from './device.type';

export type Group = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  id: number;
  devices: Device[];
};
