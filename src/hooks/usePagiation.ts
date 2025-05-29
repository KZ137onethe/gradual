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
  pageSizes: [5, 10, 20, 30, 40, 50],
  pageSize: 5,
  layout: 'total, sizes, prev, pager, next, jumper',
}

export function usePagination(initPagination: PaginationData = {}) {
  // 合并默认分页参数和传入的参数
  const paginationData = reactive({ ...DEFAULT_PAGINATION, ...initPagination })

  // 改变当前页码
  const handleCurrentChange = (value: number) => {
    paginationData.currentPage = value
  }
  // 改变每页显示条数
  const handleSizeChange = (value: number) => {
    paginationData.pageSize = value
  }

  return { paginationData, handleCurrentChange, handleSizeChange }

}