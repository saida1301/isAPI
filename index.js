import express from "express"
import { createConnection } from "mysql"

const app = express();

const connection = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "1ismobile",
  });
  
  connection.connect(function (err) {
    if (err) {
      console.error("Error connecting to database: " + err.stack);
      return;
    }
  
    console.log("Connected to database with ID " + connection.threadId);
  });
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Internal server error" });
          return;
        }
  
        if (results.length === 0) {
          res.status(401).json({ message: "Email or password is incorrect" });
          return;
        }
  
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
            return;
          }
  
          if (!isMatch) {
            res.status(401).json({ message: "Email or password is incorrect" });
            return;
          }
  
          const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
          res.json({ token });
        });
      }
    );
  });

  app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
  
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Internal server error" });
          return;
        }
  
        if (results.length > 0) {
          res.status(400).json({ message: "Email already in use" });
          return;
        }
  
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
            return;
          }
  
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              res.status(500).json({ message: "Internal server error" });
              return;
            }
  
            connection.query(
              "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
              [name, email, hash],
              (err, results) => {
                if (err) {
                  console.log(err);
                  res.status(500).json({ message: "Internal server error" });
                  return;
                }
  
                const token = jwt.sign({ id: results.insertId }, "secret", {
                  expiresIn: "1h",
                });
                res.json({ token });
              }
            );
          });
        });
      }
    );
  });

app.get("/vacancies", async (req, res) => {
  try {
    connection.query("SELECT * FROM vacancies", (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.use("/vacancies/:id", async (req, res) => {
  try {
    const { id } = req.params;

    connection.query(
      "SELECT * FROM vacancies WHERE id = ?",
      [id],
      (error, results, fields) => {
        if (error) throw error;
        res.json(results);
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.get("/companies", async (req, res) => {
  try {
    connection.query("SELECT * FROM companies", (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})
app.use("/companies/:id", async (req, res) => {
  try {
    const { id } = req.params;

    connection.query(
      "SELECT * FROM companies WHERE id = ?",
      [id],
      (error, results, fields) => {
        if (error) throw error;
        res.json(results);
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/sectors", async (req, res) => {
  try {
    connection.query("SELECT * FROM sectors", (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.use("/sectors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    connection.query(
      "SELECT * FROM sectors WHERE id = ?",
      [id],
      (error, results, fields) => {
        if (error) throw error;
        res.json(results);
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/categories", async (req, res) => {
  try {
    connection.query("SELECT * FROM categories", (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})


app.use("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    connection.query(
      "SELECT * FROM categories WHERE id = ?",
      [id],
      (error, results, fields) => {
        if (error) throw error;
        res.json(results);
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/cv", async (req, res) => {
  try {
    connection.query("SELECT * FROM cv", (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})


app.use("/cv/:id", async (req, res) => {
  try {
    const { id } = req.params;

    connection.query(
      "SELECT * FROM cv WHERE id = ?",
      [id],
      (error, results, fields) => {
        if (error) throw error;
        res.json(results);
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/vacancy/:companyId", (req, res) => {
  const { companyId } = req.params;

  const sql = `SELECT * FROM vacancies WHERE company_id IN (SELECT id FROM companies WHERE id = ${companyId})`;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error retrieving favorites");
    }

    return res.json(results);
  });
});

app.get("/trainings", async (req, res) => {
  try {
    connection.query("SELECT * FROM trainings", (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})


app.use("/trainings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    connection.query(
      "SELECT * FROM trainings WHERE id = ?",
      [id],
      (error, results, fields) => {
        if (error) throw error;
        res.json(results);
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/vacancie/:categoryId", (req, res) => {
  const { categoryId } = req.params;

  const sql = `SELECT * FROM vacancies WHERE category_id IN (SELECT id FROM categories WHERE id = ${categoryId})`;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error retrieving favorites");
    }

    return res.json(results);
  });
});

app.get("/review", async (req, res) => {
  try {
    connection.query("SELECT * FROM review", (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

  app.listen(5000, () => {
    console.log("Server listening on port 5000");
  });