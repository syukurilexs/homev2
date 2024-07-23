import { StateE } from '../enums/state.enum';
import { ActionOld, DeviceOld } from './device-old.type';

export type Scene = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  sceneDevice: SceneDevice[];
  sceneAction: SceneAction[];
};

export type SceneDevice = {
  sceneId: number;
  deviceId: number;
  state: StateE;
  createdAt: string;
  updatedAt: string;
  device: DeviceOld;
};

export interface SceneAction {
  id: number
  createdAt: string
  updatedAt: string
  action: ActionOld
}
