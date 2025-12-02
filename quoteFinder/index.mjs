import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "ysp9sse09kl0tzxj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "egyljk8fk1nntjnt",
    password: "od00ub57ojuona94",
    database: "qzqguloj35scvg60",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
   // authors for the “Search by Author” dropdown
   let sqlAuthors =  `SELECT authorId, firstName, lastName
                      FROM q_authors
                      ORDER BY lastName`;
   const [authors] = await pool.query(sqlAuthors);

   // DISTINCT category list for “Search by Category”
   let sqlCategories = `SELECT DISTINCT category
                        FROM q_quotes
                        ORDER BY category`;
   const [categories] = await pool.query(sqlCategories);

   res.render("index", { authors, categories });
});

app.get('/searchByKeyword', async (req, res) => {
    let keyword = req.query.keyword;
    let sql = `SELECT quote, authorId, firstName, lastName
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
});

app.get('/searchByAuthor', async (req, res) => {
    let userAuthorId = req.query.authorId;
    let sql = `SELECT authorId, firstName, lastName, quote
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE authorId = ?`;
    let sqlParams = [userAuthorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
});

app.get('/api/author/:id', async (req, res) => {
  let authorId = req.params.id;
  let sql = `SELECT *
            FROM q_authors
            WHERE authorId = ?`;           
  let [rows] = await pool.query(sql, [authorId]);
  res.send(rows)
});

app.get('/searchByCategory', async (req, res) => {
    let category = req.query.category;

    let sql = `SELECT quote, authorId, firstName, lastName, category
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE category = ?`;

    const [rows] = await pool.query(sql, [category]);
    res.render("results", { quotes: rows });
});

app.get('/searchByLikes', async (req, res) => {
    let minLikes = req.query.minLikes || 0;
    let maxLikes = req.query.maxLikes || 999999;

    let sql = `
        SELECT quote, authorId, firstName, lastName, likes
        FROM q_quotes
        NATURAL JOIN q_authors
        WHERE likes BETWEEN ? AND ?
    `;
    
    const [rows] = await pool.query(sql, [minLikes, maxLikes]);

    res.render("results", { quotes: rows });
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})