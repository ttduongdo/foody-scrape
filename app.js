const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();


mongoose.connect(process.env.DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const RestaurantSchema = new mongoose.Schema({
	restaurantImage: { type: String },
	name: { type: String },
	location: { type: String },
	address: { type: String },
	openTime: { type: String },
	priceRange: { type: String },
	type: { type: String },
	prepareTime: { type: String },
},{ collection: 'restaurants' });


const Restaurant = mongoose.model('Restaurant', RestaurantSchema);


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/type", async (req, res) => {
	const types = req.query.type;
	let query = {};

	if (types) {
		if (Array.isArray(types)) {
			const regexTypes = types.map((type) => new RegExp(type, "i"));
			query.type = { $in: regexTypes };
		} else {
			query.type = new RegExp(types, "i");
		}
	}

	const restaurants = await Restaurant.find(query);
	res.json(restaurants);
});

app.listen(3000, () =>
    console.log(`Listening on port 3000!`)
);
