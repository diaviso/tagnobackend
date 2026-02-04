export declare enum VehicleStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}
export declare class AdminVehicleQueryDto {
    status?: VehicleStatus;
}
export declare class RejectVehicleDto {
    comment?: string;
}
export declare class AdminUserQueryDto {
    search?: string;
}
export declare class UpdateUserRoleDto {
    role: 'USER' | 'ADMIN';
}
