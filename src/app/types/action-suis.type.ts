export type ActionSuis = {
  id: number;
  key: string;
  value: string;
  suis: {
    id: number;
    topic: string;
    device: {
      id: number;
      name: string;
      remark: string;
    };
  };
};
