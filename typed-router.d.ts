/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...all]': RouteRecordInfo<'/[...all]', '/:all(.*)', { all: ParamValue<true> }, { all: ParamValue<false> }>,
    '/admin/data_sources/': RouteRecordInfo<'/admin/data_sources/', '/admin/data_sources', Record<never, never>, Record<never, never>>,
    '/admin/data_sources/[id]': RouteRecordInfo<'/admin/data_sources/[id]', '/admin/data_sources/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/admin/home': RouteRecordInfo<'/admin/home', '/admin/home', Record<never, never>, Record<never, never>>,
    '/admin/query_configs/': RouteRecordInfo<'/admin/query_configs/', '/admin/query_configs', Record<never, never>, Record<never, never>>,
    '/admin/query_configs/[id]': RouteRecordInfo<'/admin/query_configs/[id]', '/admin/query_configs/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/admin/query_logs/': RouteRecordInfo<'/admin/query_logs/', '/admin/query_logs', Record<never, never>, Record<never, never>>,
    '/admin/signs/': RouteRecordInfo<'/admin/signs/', '/admin/signs', Record<never, never>, Record<never, never>>,
    '/admin/signs/new': RouteRecordInfo<'/admin/signs/new', '/admin/signs/new', Record<never, never>, Record<never, never>>,
    '/login': RouteRecordInfo<'/login', '/login', Record<never, never>, Record<never, never>>,
  }
}
