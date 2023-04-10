const express = require("express");
const app = express();

const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const URL = process.env.DB    // Replace with your MongoDB connection string
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

// Get all Income transactions
app.get("/transactions/income", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("Money_Manager");
    const collection = db.collection("Income");
    const transactions = await collection.find({"type":"income"}).toArray();
    console.log(transactions);
    await connection.close();
    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//Get all weekly transactions
app.get("/transactions/income/weekly", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("Money_Manager");
    const collection = db.collection("Income");
    const transactions = await collection.find({"earnedby":"weekly"}).toArray();
    console.log(transactions);
    await connection.close();
    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


app.get("/transactions/income/monthly", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("Money_Manager");
    const collection = db.collection("Income");
    const transactions = await collection.find({ "incomeat": "monthly"}).toArray();
    console.log(transactions);
    await connection.close();
    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/transactions/income/yearly", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("Money_Manager");
    const collection = db.collection("yearly");
    const transactions = await collection.find({}).toArray();
    console.log(transactions);
    await connection.close();
    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


















// Post a new Income transaction
app.post("/transactions/income", async (req, res) => {    //trannsaction.length-1 
  try {
    console.log(req.body);
    const connection = await mongoclient.connect(URL);
    const db = connection.db("Money_Manager");
    const collection = db.collection("Income");
    const operation = await collection.insertOne({
      ...req.body,
      isDeleted: false,
    });
    await connection.close();
    res.json({ message: "Income transaction added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get all Expense transactions
app.get("/transactions/expenses", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("Money_Manager");
    const collection = db.collection("Expenses");
    const transactions = await collection.find({}).toArray();
    await connection.close();
    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Post a new Expense transaction
app.post("/transactions/expenses", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("Money_Manager");
    const collection = db.collection("Expenses");
    const operation = await collection.insertOne({
      ...req.body,
      
      isDeleted: false,
    });
    console.log(req.body);
    await connection.close();
    res.json({ message: "Expense transaction added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("/transactions/:type/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("Money_Manager");
    const type = req.params.type;
    const collection = db.collection(type === "income" ? "Income" : "Expenses");
    const transactionId = req.params.id;
    // const operation = await collection.findOneAndUpdate(
    //   { _id: new mongodb.ObjectId(`${transactionId}`) },
    //   { $set: req.body }
    // );
    const operation = await collection.findOneAndUpdate(
        { _id: new mongodb.ObjectId(`${transactionId}`) },
        { $set: req.body }
      );
    console.log(operation);
    console.log(req.body);
    await connection.close();
    res.json({ message: "Transaction updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/transactions/:type/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("Money_Manager");
    const type = req.params.type;
    const collection = db.collection(type === "income" ? "Income" : "Expenses");
    const transactionId = req.params.id;
    console.log(transactionId);
    const operation = await collection.deleteOne({
      _id: new mongodb.ObjectId(`${transactionId}`),
    });
    console.log(operation);
    await connection.close();
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

const port = process.env.PORT || 8001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
