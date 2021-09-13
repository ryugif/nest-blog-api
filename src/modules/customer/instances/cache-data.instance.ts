export interface User {
    id: string;
    first_name: string;
    last_name?: string;
    email: string;
    gender: string;
    address: string;
    telephone: string;
    employeeId: string;
    roleId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CacheData {
    token: string;
    expireIn: number;
    user: User;
    loginAt: Date;
}