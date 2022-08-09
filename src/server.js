// Initialization
const express = require("express");
const port = process.env.PORT || 5000;
const app = express();
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../swagger_output.json");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
console.log(`Documentation available at http://localhost:${port}/api-docs`);
mongoose.connect(
	"mongodb+srv://sudarshanlamichhane:prasu2133@sudarshan.hsunu.mongodb.net/mangadb",
	{
		useNewUrlParser: true,
		// useFindAndModify: false,
		useUnifiedTopology: true,
		bufferCommands: false,
		autoIndex: false,
	}
);

const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDb connected");
});

// App Route (/)
app.get("/", function (req, res) {
	const response = { message: "API Works!" };
	res.json(response);
});

//middleware
// app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.json());

const mangaRouter = require("./routes/Manga");
app.use("/manga", mangaRouter);

const genreRouter = require("./routes/Genre");
app.use("/genre", genreRouter);

const chapterRouter = require("./routes/Chapter");
app.use("/chapter", chapterRouter);

const userRouter = require("./routes/Users");
app.use("/user", userRouter);

//Starting the server on a port
app.listen(port, "0.0.0.0", () =>
	console.log(`Server started at Port ${port}`)
);
