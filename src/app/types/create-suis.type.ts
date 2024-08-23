import { Action } from './action.type';
import { CreateAction } from './create-action.type';
import { DeviceCommon } from './device-common.type';

export type CreateSuis = Omit<DeviceCommon,'id' | 'type'> & {

  action: CreateAction[];
};
