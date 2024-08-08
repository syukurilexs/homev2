import { StateE } from "../enums/state.enum";

export type CreateScene = {
  name: string;
  devices: CreateSceneDevices[];
  actions: number[];
};

export type CreateSceneDevices = {
  id: number;
  state: StateE;
};
