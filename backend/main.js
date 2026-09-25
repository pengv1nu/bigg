const express = require("express");
const app = express();

app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

app.use(express.json());

const requestLog = new Map();

app.use((req, res, next) => {
	const ip = req.ip;
	const now = Date.now();
	const WINDOW_MS = 10000;
	const MAX_REQUESTS = 5;

	if (!requestLog.has(ip)) requestLog.set(ip, []);

	let timestamps = requestLog.get(ip);

	timestamps = timestamps.filter((timestamp) => now - timestamp < WINDOW_MS);

	timestamps.push(now);
	requestLog.set(ip, timestamps);

	if (timestamps.length > MAX_REQUESTS)
		return res.status(429).json({ error: "Слишком много запросов" });

	next();
});

app.post("/echo", (req, res) => {
	res.json(req.body);
});

const checkAdminAuth = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	if (!authHeader)
		return res.status(401).json({
			error: "Доступ запрещен. Отсутствует заголовок Authorization",
		});

	next();
};

app.get("/admin", checkAdminAuth, (req, res) => {
	res.json({ message: "Добро пожаловать в админ-панель!" });
});

app.listen(3000, () => {
	console.log(`Сервер успешно запущен на порту 3000`);
});
