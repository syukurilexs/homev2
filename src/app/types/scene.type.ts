import { StateE } from '../enums/state.enum';
import { Action } from './action.type';
import { Device } from './device.type';

export interface SceneDevice {
  state: StateE;
  device: Device;
}

export interface Scene {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  sceneDevice: SceneDevice[];
  actions: Action[];
}
