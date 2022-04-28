export const ServerError = class ServerError extends Error {
    public status: number | undefined;
    public data: any;

    constructor(message?: string, status?: number, data?: any) {
        super(message);
        this.status = status;
        this.data = data;
    }
};
