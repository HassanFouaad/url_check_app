class Pagination {
  private page;
  private limit;
  constructor(page = 1, limit = 50) {
    this.page = page;
    this.limit = limit || 50;
  }

  getOffset() {
    return 0 + (this.page - 1) * this.limit;
  }

  getNumOfPages(count: number) {
    return Math.ceil(count / this.limit);
  }

  getLimit() {
    return this.limit ? parseInt(String(this.limit)) : 50;
  }

  getMetaData(count: number) {
    return {
      thisPage: parseInt(String(this.page)),
      limit: parseInt(String(this.limit)),
      allPages: parseInt(String(this.getNumOfPages(count))),
      count: count,
    };
  }
}

export default Pagination;
