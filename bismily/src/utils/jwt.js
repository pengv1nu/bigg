import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
	return jwt.sign(
		{ id: user.id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
	);
}
