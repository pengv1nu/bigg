import express from "express";
import { User, sequelize } from "./db.js";

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.create({ email, password });

		res.status(201).json({
			id: user.id,
			email: user.email,
		});
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			const messages = error.errors.map((e) => e.message);
			return res.status(400).json({ errors: messages });
		}
		if (error.name === "SequelizeUniqueConstraintError") {
			return res.status(409).json({ error: "Email уже занят" });
		}
		res.status(500).json({ error: "Внутренняя ошибка сервера" });
	}
});
app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });

		if (!user || !(await user.validPassword(password))) {
			return res.status(401).json({ error: "Неверные учётные данные" });
		}

		res.json({ id: user.id, email: user.email });
	} catch (error) {
		res.status(500).json({ error: "Внутренняя ошибка сервера" });
	}
});
await sequelize.sync();
app.listen(3000, () => console.log("Сервер запущен на порту 3000"));
