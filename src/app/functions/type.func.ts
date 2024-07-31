import { Device } from "../types/device.type";
import { Fan } from "../types/fan.type";

export function getAsFan(device: Device) {
  return device as Fan;
}
