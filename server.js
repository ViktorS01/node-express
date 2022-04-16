// Create express app
const express = require("express")
const app = express()
const db = require("./database.js")
const cors = require("cors");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Server port
const HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/notes", (req, res, next) => {
    const sql = "select * from note"
    const params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/tags", (req, res, next) => {
    const sql = "select * from tag"
    const params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.post("/api/tag", (req, res, next) => {
    const data = {
        text: req.body.text,
    }
    const sql ='INSERT INTO tag (text) VALUES ($text)'
    const params =[data.text]

    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.get("/api/note/:id", (req, res, next) => {
    const sql = "select * from note where id = $id"
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});

app.patch("/api/note/:id", (req, res, next) => {
    const data = {
        date: req.body.date,
        text: req.body.text,
        title: req.body.title,
        tag: req.body.tag,
    }
    db.run(
        `UPDATE note set
           date = COALESCE(?,date),
           text = COALESCE(?,text),
           title = COALESCE(?,title),
           tag = COALESCE(?,tag)
           WHERE id = ?`,
        [data.date, data.text, data.title, data.tag, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
})

app.post("/api/note", (req, res, next) => {
    const data = {
        date: req.body.date,
        text: req.body.text,
        title: req.body.title,
        tag: req.body.tag
    }

    const sql ='INSERT INTO note (date, text, title, tag) VALUES ($date, $text, $title, $tag)'
    const params =[data.date, data.text, data.title, data.tag]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.delete("/api/note/:id", (req, res, next) => {
    db.run(
        'DELETE FROM note WHERE id = $id',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
})

app.delete("/api/tag/:id", (req, res, next) => {
    db.run(
        'DELETE FROM tag WHERE id = $id',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
})