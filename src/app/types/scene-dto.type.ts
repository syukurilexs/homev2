export type SceneDto = {
    name: string;
    devices: SceneDeviceDto[];
    actions: number[];
}

export type SceneDeviceDto = {
    id: number,
    state: boolean;
}