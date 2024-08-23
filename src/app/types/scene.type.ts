import { StateE } from '../enums/state.enum';
import { ActionSuis } from './action-suis.type';
import { Device } from './device.type';

export interface SceneDevice {
  state: StateE;
  device: Device;
}

export interface SceneAction {
  sceneId: number;
  actionId: number;
  action: ActionSuis;
}

export interface Scene {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  sceneDevice: SceneDevice[];
  sceneAction: SceneAction[];
}
