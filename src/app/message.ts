export interface Message {
  user: string;
  msg: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}
