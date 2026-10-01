import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
	const token =
		req.cookies?.accessToken ||
		req.headers.authorization?.replace("Bearer ", "");

	if (!token) {
		return res.status(401).json({ error: "Требуется авторизация" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res
			.status(403)
			.json({ error: "Невалидный или просроченный токен" });
	}
}
