import { Action } from "./action.type";
import { CommonDevice } from "./common-device.type";

export type Suis = CommonDevice & {
    action: Action[];
}
