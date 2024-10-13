// src/types/auth.types.ts
export interface LoginRequest {
    email: string;
    password: string;
}

export interface CreateUserRequest {
    email: string;
    name: string;
    phone: string;
    password?: string;
}

export interface CreateSalespersonRequest extends CreateUserRequest {
    employeeId: string;
    panNumber?: string;
    city?: string;
    address?: string;
}

export interface CreateDistributorRequest extends CreateUserRequest {
    distributorId: string;
    panNumber?: string;
    gstId?: string;
    city?: string;
    address?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface JWTPayload {
    id: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface CustomError extends Error {
    statusCode?: number;
}