import { DeviceOld } from './device-old.type';

export type SceneDtoOld = {
  name: string;
  data: SceneData[];
  actions: Number[];
};

export type SceneData = {
  state: boolean;
  device: DeviceOld;
};
