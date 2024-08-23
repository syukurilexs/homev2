import { DeviceCommon } from "./device-common.type";
import { Fan } from "./fan.type";

export type DeviceFan = DeviceCommon & {
	fan: Fan;
}