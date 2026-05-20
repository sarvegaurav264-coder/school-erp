// Async handler wrapper - eliminates try-catch in every controller
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Pagination helper
const getPagination = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// Pagination response
const paginateResponse = (data, total, page, limit) => ({
  data,
  pagination: {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasMore: page * limit < total
  }
});

// Build search filter
const buildSearchFilter = (query, fields) => {
  if (!query.search) return {};
  const regex = new RegExp(query.search, 'i');
  return { $or: fields.map(f => ({ [f]: regex })) };
};

module.exports = { asyncHandler, getPagination, paginateResponse, buildSearchFilter };
