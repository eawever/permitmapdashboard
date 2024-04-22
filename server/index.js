import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "3v4n3v4n",
    database: "cityoforlandopermit",
});

app.use(express.json());
app.use(cors());

app.get("/permits", (req, res) => {
    db.query("SELECT * FROM permits", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error reaching DB", message: err.message });
        } else {
            res.json(result);
        }
    });
});

app.get("/permits/:permitId", (req, res) => {
    const permitId = req.params.permitId;
    db.query("SELECT * FROM permits WHERE permitId = ?", [permitId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error reaching DB", message: err.message });
        } else if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: "Permit not found" });
        }
    });
});

app.post("/permits", (req, res) => {
    const query = "INSERT INTO permits (permitName, submitterName, submittedDate, endDate, status, address, link) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.permitName,
        req.body.submitterName,
        req.body.submittedDate,
        req.body.endDate,
        req.body.status,
        req.body.address,
        req.body.link
    ];
    db.query(query, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error reaching DB", message: err.message });
        } else {
            res.status(201).json({ message: "Permit added successfully", permitId: result.insertId });
        }
    });
});

app.put("/permits/:permitId", (req, res) => {
    const permitId = req.params.permitId;
    const query = "UPDATE permits SET permitName = ?, submitterName = ?, submittedDate = ?, endDate = ?, status = ?, address = ?, link = ? WHERE permitId = ?";
    const values = [
        req.body.permitName,
        req.body.submitterName,
        req.body.submittedDate,
        req.body.endDate,
        req.body.status,
        req.body.address,
        req.body.link,
        permitId
    ];
    db.query(query, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error reaching DB", message: err.message });
        } else {
            res.json({ message: "Permit updated successfully", affectedRows: result.affectedRows });
        }
    });
});

app.delete("/permits/:permitId", (req, res) => {
    const permitId = req.params.permitId;
    const query = "DELETE FROM permits WHERE permitId = ?";
    db.query(query, [permitId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error reaching DB", message: err.message });
        } else {
            res.json({ message: "Permit deleted successfully", affectedRows: result.affectedRows });
        }
    });
});

const port = 8800;
app.listen(port, () => {
    console.log("Server started on port " + port + ". Backend Reached :).");
});
