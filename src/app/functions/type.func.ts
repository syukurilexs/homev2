import { Device } from '../types/device.type';
import { FanOld } from '../types/fan.type';
import { Suis } from '../types/suis.type';

export function getAsFan(device: Device) {
  return device as FanOld;
}

export function getAsSuis(device: Device) {
  // return device as Suis;
}
