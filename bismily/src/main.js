const express = require("express");
const corsMiddleware = require("./cors");
const rateLimit = require("./middleware/rateLimit");

const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(express.json());

app.use(rateLimit);

app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
	next();
});

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.get("/", (req, res) => {
	res.json({ status: "ok", message: "Express backend is running" });
});

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
