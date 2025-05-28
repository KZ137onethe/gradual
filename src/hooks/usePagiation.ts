interface PaginationData {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

// 默认的分页参数
const DEFAULT_PAGINATION: PaginationData = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 30, 40, 50],
  pageSize: 10,
  layout: 'total, sizes, prev, pager, next, jumper',
}