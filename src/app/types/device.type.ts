import { Contact } from './contact.type';
import { DeviceFan } from './device-fan.type';
import { DeviceLight } from './device-light.type';
import { DeviceSuis } from './device-suis.type';
export type Device = DeviceSuis | DeviceLight | DeviceFan;
