import { DeviceE } from "../enums/device-type.enum";

export type CommonDevice = {
    // Make optional for id because 
    // when data return from server we need to have id
    // If if want to send data to server we sometime dont nee id
    // Eg: to create device we don't need id
    id?: number;

    name: string;
    topic: string;
    type: DeviceE;
    remark: string;
}