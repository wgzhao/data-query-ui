interface Basic {
  createdAt: Date;
  updatedAt: Date;
}

interface DataSource extends Basic {
  no: string;
  name: string;
  url: string;
  username: string;
  password: string;
  driver: string;
}

export interface QueryConfig extends Basic {
  id: number;
  name: string;
  description: string;
  selectId: string;
  querySql: string;
  dataSource: string;
  enabled: boolean;
  cacheTime: Int16Array;
  note: string;
  enableCache: boolean;
}

export interface Sign extends Basic {
  appId: string;
  appKey: string;
  applier: string;
  enabled: boolean;
}

interface User {
  username: string;
  password: string;
}

type Toast = {
  showToast: boolean;
  msg: string;
  color: string;
};

export type { User, DataSource, Toast };
