export interface User {
	id?: string; // optional if not yet created
	name: string;
	email: string;
	password: string;
	role?: 'admin' | 'user'; // optional because it has a default value
	banned?: boolean;        // optional because it has a default value
	avatar?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
