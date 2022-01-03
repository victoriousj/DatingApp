export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPAges: number;
}

export class PaginatedResults<T> {
    result: T;
    pagination: Pagination;
}
