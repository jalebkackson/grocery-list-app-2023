const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-list-app';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Grocery item model
const groceryItemSchema = new mongoose.Schema({
	name: { type: String, required: true },
	quantity: { type: Number, default: 1 },
	checked: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now }
});

const GroceryItem = mongoose.model('GroceryItem', groceryItemSchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
	res.send('Grocery list app is running');
});

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.get('/api/items', async (req, res) => {
	try {
		const items = await GroceryItem.find().sort({ createdAt: -1 });
		res.json(items);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post('/api/items', async (req, res) => {
	try {
		const item = new GroceryItem(req.body);
		await item.save();
		res.status(201).json(item);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

app.delete('/api/items/:id', async (req, res) => {
	try {
		await GroceryItem.findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Create the HTTP server so it can be closed gracefully on shutdown
const server = app.listen(PORT, () => {
	console.log(`Grocery list app listening on port ${PORT}`);
});

// Gracefully shut down on Railway restarts/deploys (SIGTERM) or local
// interrupts (SIGINT) instead of letting the process get killed mid-request.
function gracefulShutdown(signal) {
	console.log(`${signal} received: starting graceful shutdown`);

	server.close(async (err) => {
		if (err) {
			console.error('Error while closing HTTP server:', err);
			process.exitCode = 1;
		} else {
			console.log('HTTP server closed');
		}

		try {
			await mongoose.connection.close();
			console.log('MongoDB connection closed');
		} catch (closeErr) {
			console.error('Error while closing MongoDB connection:', closeErr);
			process.exitCode = 1;
		}

		process.exit(process.exitCode || 0);
	});

	// Force exit if shutdown takes too long, so the process doesn't hang
	// past Railway's drain period.
	setTimeout(() => {
		console.error('Graceful shutdown timed out, forcing exit');
		process.exit(1);
	}, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
