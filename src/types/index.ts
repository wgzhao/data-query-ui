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

interface QueryConfig extends Basic {
  selectId: string;
  querySql: string;
  dataSource: string;
  enabled: boolean;
  cacheTime: Int16Array;
  note: string;
  enableCache: boolean;
}

interface Sign extends Basic {
  appId: string;
  appKey: string;
  applier: string;
}

interface User {
  username: string;
  password: string;
}

export { User, Sign, DataSource, QueryConfig };
