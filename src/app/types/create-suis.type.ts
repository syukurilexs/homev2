import { CreateAction } from './create-action.type';
import { DeviceCommon } from './device-common.type';

export type CreateSuis = Omit<DeviceCommon, 'id' | 'type'> & {
  topic: string;
  action: CreateAction[];
};
