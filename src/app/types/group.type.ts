import { Device } from './device.type';

export interface Group {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  id: number;
  devices: Device[];
}
