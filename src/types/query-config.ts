interface QueryConfig extends Basic{
  selectId: string,
  querySql: string,
  dataSource: string,
  enabled: boolean,
  cacheTime: Int16Array,
  note: string,
  enableCache: boolean
}

export default QueryConfig;
