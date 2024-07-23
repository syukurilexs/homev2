import { CommonDevice } from "./common-device.type";

export type Contact = CommonDevice & {
    key: string;
}