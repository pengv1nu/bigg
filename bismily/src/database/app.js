import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { sequelize } from "./db.js";
import { User } from "./models/User.js";
import { generateAccessToken } from "../utils/jwt.js"; // ← ../ = на уровень вверх из database/
import { verifyToken } from "../../middleware/auth.js"; // ← ../../ = на два уровня вверх

const app = express();
app.use(express.json());
app.use(cookieParser());

// Регистрация
app.post("/register", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.create({ email, password });
		res.status(201).json({ id: user.id, email: user.email });
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			return res
				.status(400)
				.json({ errors: error.errors.map((e) => e.message) });
		}
		if (error.name === "SequelizeUniqueConstraintError") {
			return res.status(409).json({ error: "Email уже занят" });
		}
		res.status(500).json({ error: "Внутренняя ошибка сервера" });
	}
});

// Логин
app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });

		if (!user || !(await user.validPassword(password))) {
			return res.status(401).json({ error: "Неверные учётные данные" });
		}

		const token = generateAccessToken(user);

		res.cookie("accessToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 1000,
		});

		res.json({ id: user.id, email: user.email });
	} catch (error) {
		res.status(500).json({ error: "Внутренняя ошибка сервера" });
	}
});

// Выход
app.post("/logout", (req, res) => {
	res.clearCookie("accessToken");
	res.json({ message: "Выход выполнен" });
});

// Защищённый маршрут
app.get("/profile", verifyToken, async (req, res) => {
	const user = await User.findByPk(req.user.id, {
		attributes: ["id", "email"],
	});
	res.json(user);
});

await sequelize.sync();
app.listen(3000, () => console.log("Сервер запущен на порту 3000"));
