import { Device } from '../types/device.type';
import { Fan } from '../types/fan.type';
import { Suis } from '../types/suis.type';

export function getAsFan(device: Device) {
  return device as Fan;
}

export function getAsSuis(device: Device) {
  return device as Suis;
}
