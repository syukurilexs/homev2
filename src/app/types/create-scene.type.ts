import { StateE } from '../enums/state.enum';

export interface CreateScene {
  name: string;
  devices: CreateSceneDevices[];
  actions: number[];
}

export interface CreateSceneDevices {
  id: number;
  state: StateE;
}
