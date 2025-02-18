export interface AppListPayload {
  name: string;
  page: number;
  size: number;
}

export interface AppProfile {
  instance_id: string;
}

export interface AppAddPayload {
  name:string;
  description:string;
  fofa_finger:string;
  hunter_finger:string;
  version:string;
  company:string;
}

export interface AppUpdatePayload {
  instance_id: string;
  name:string;
  description:string;
  fofa_finger:string;
  hunter_finger:string;
  version:string;
  company:string;
}

export interface AppDeletePayload {
  instance_id: Array<string>;
}
