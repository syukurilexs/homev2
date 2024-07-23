export type Action = {
    id?: number;
    value: string;
    key: string;

    // This will be optional
    //
    // If it is part of Light / Fan it will exist because we need to know
    // this action come from which switch
    //
    // If it is part of switch it will not there because this action is
    // subset of switch 
    name?: string;
}