export class Me {
    id: number;
    appId: number;
    appVersion: string;
    webUserId: number;
    email: string;
    deviceOS: string;
    deviceOSVersion: string;
    deviceToken: string;
    guid: string;
    inbox: object;
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }
