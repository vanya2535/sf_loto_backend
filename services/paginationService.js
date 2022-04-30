class paginationService {
  getPaginationHeaders(count, page, perPage) {
    return {
      'X-Pagination-Total-Count': count,
      'X-Pagination-Page-Count': Math.ceil(count / (perPage || 20)),
      'X-Pagination-Current-Page': page || 1,
      'X-Pagination-Per-Page': perPage || 20
    }
  }
}

module.exports = new paginationService()