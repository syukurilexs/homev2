import { StateE } from '../enums/state.enum';
import { Action } from './action.type';
import { Device } from './device.type';

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
  device: Device;
};

export interface SceneAction {
  id: number
  createdAt: string
  updatedAt: string
  action: Action
}
