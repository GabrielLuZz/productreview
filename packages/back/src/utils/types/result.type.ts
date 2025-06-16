

export interface ApiResponse<TData = any> {
    status: number,
    error: Error | undefined
    data: TData | undefined
}

export interface Result<TData = any> {
    error: Error | undefined
    data: TData | undefined
}