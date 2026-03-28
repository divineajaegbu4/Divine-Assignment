export class Pagination {
  constructor(page, limit, queryResults, paginationLabel) {
    this.page = page;
    this.limit = limit;
    this.queryResults = queryResults;
    this.paginationLabel = paginationLabel;
  }

  async paginate() {
    if (!this.page || this.page === 0) {
      this.page = 1;
    }
    if (!this.limit || this.limit === 0) {
      this.limit = 10;
    }
    if (this.limit > 20) {
      this.limit = 20;
    }

    const result_length = this.queryResults.length;
    const total_pages = Math.ceil(this.queryResults.length / this.limit);

    if (this.queryResults.length === 0) {
      return {
        [this.paginationLabel]: [],
        current_page: this.page,
        previous_page: this.page <= 1 ? null : this.page - 1,
        next_page:
          this.page >= Math.ceil(result_length / this.limit)
            ? null
            : this.page + 1,
        page_items: this.queryResults.length,
        total_items: result_length,
        total_pages,
        limit: this.limit,
      };
    }

    const offset = (this.page - 1) * this.limit;

    this.queryResults = this.queryResults.slice(offset, offset + this.limit);

    return {
      [this.paginationLabel]: this.queryResults,
      current_page: this.page,
      previous_page: this.page <= 1 ? null : this.page - 1,
      next_page:
        this.page >= Math.ceil(result_length / this.limit)
          ? null
          : this.page + 1,
      page_items: this.queryResults.length,
      total_items: result_length,
      total_pages,
      limit: this.limit,
    };
  }
}
