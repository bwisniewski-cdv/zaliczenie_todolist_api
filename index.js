const { application } = require("express");
const express = require("express");
const sql = require('mssql');
const bodyParser = require('body-parser');
const router = express.Router();

const app = express();

const config = {
    user: 'bartek_cdv',
    password: 'MySuperPassword1',
    server: 'bartekcdv.database.windows.net',
    database: 'ShoppingList',
    options: {
        encrypt: true
    }
};

app.use(bodyParser.json());

sql.connect(config, err => {
    if (err) console.log(err);
    else console.log('Connected to Azure SQL Database');
});

//SETS

// GET All Sets
app.get('/sets', (req, res) => {
    sql.connect(config, (err) => {
        if (err) console.log(err);
    
        let request = new sql.Request();
        request.query('SELECT id, title FROM sets', (err, result) => {
          if (err) console.log(err);
    
          res.send(result.recordset);
        });
      });
    });

// GET by ID
app.get('/sets/:id', (req, res) => {
    sql.connect(config, (err) => {
        if (err) console.log(err);
    
        const request = new sql.Request();
        request.input('id', req.params.id);
        request.query('SELECT id, title FROM sets WHERE id = @id', (err, result) => {
          if (err) console.log(err);
    
          res.send(result.recordset);
        });
      });
    });

// POST a new set
app.post('/sets', (req, res) => {
    // basic validation
    if (!req.body.title) {
        return res.status(400).send({ message: 'Title is required' });
    }
    // create a new shopping list
    const request = new sql.Request();
    request.input('title', req.body.title);
    request.query('INSERT INTO Sets (title) VALUES (@title)', (err, result) => {
        if (err) {
            res.status(500).send({ message: err.message });
        } else {
            res.json(result);
        }
    });
});

// DELETE Sets
app.delete('/sets/:id', (req, res) => {
    // basic validation
    if (!req.params.id) {
        return res.status(400).send({ message: 'ID is required' });
    }
    // delete a Sets
    const request = new sql.Request();
    request.input('id', req.params.id);
    request.query('DELETE FROM Sets WHERE id = @id', (err, result) => {
        if (err) {
            res.status(500).send({ message: err.message });
        } else {
            res.json(result);
        }
    });
});

// UPDATE Sets
app.put('/sets/:id', (req, res) => {
    // basic validation
    if (!req.params.id) {
        return res.status(400).send({ message: 'ID is required' });
    }
    if (!req.body.title) {
        return res.status(400).send({ message: 'Title is required' });
    }
    // update a Sets
    const request = new sql.Request();
    request.input('id', req.params.id);
    request.input('title', req.body.title);
    request.query('UPDATE Sets SET title=@title WHERE id = @id', (err, result) => {
        if (err) {
            res.status(500).send({ message: err.message });
        } else {
            res.json(result);
        }
    });
});

//PURCHASES

// // GET All Purchcases
app.get('/list', (req, res) => {
    sql.connect(config, (err) => {
        if (err) console.log(err);
    
        let request = new sql.Request();
        request.query('SELECT id, description, isDone, id_set FROM Purchases', (err, result) => {
          if (err) console.log(err);
    
          res.send(result.recordset);
        });
      });
    });

// // GET by ID
app.get('/list/id/:id', (req, res) => {
    sql.connect(config, (err) => {
        if (err) console.log(err);
    
        const request = new sql.Request();
        request.input('id', req.params.id);
        request.query('SELECT id, description, isDone, id_set FROM Purchases WHERE id = @id', (err, result) => {
          if (err) console.log(err);
    
          res.send(result.recordset);
        });
      });
    });

// // GET by set_ID
app.get('/list/set_id/:id_set', (req, res) => {
    sql.connect(config, (err) => {
        if (err) console.log(err);
    
        const request = new sql.Request();
        request.input('id_set', req.params.id_set);
        request.query('SELECT id, description, isDone, id_set FROM Purchases WHERE id_set = @id_set', (err, result) => {
          if (err) console.log(err);
    
          res.send(result.recordset);
        });
      });
    });

// // POST a new Purchcases
app.post('/list', (req, res) => {
    // basic validation
    if (!req.body.description) {
        return res.status(400).send({ message: 'Description is required' });
    }
    if (!req.body.isDone) {
        return res.status(400).send({ message: 'IsDone is required' });
    }
    if (!req.body.id_set) {
        return res.status(400).send({ message: 'Id_set is required' });
    }
    // create a new Purchcases
    const request = new sql.Request();
    request.input('description', req.body.description);
    request.input('isDone', req.body.isDone || false);
    request.input('id_set', req.body.id_set);
    request.query('INSERT INTO Purchases (description, isDone, id_set) VALUES (@description, @isDone, @id_set)', (err, result) => {
        if (err) {
            res.status(500).send({ message: err.message });
        } else {
            res.json(result);
        }
    });
});

// DELETE Purchcases
app.delete('/list/:id', (req, res) => {
    // basic validation
    if (!req.params.id) {
        return res.status(400).send({ message: 'ID is required' });
    }
    // delete a shopping list
    const request = new sql.Request();
    request.input('id', req.params.id);
    request.query('DELETE FROM Purchases WHERE id = @id', (err, result) => {
        if (err) {
            res.status(500).send({ message: err.message });
        } else {
            res.json(result);
        }
    });
});

// UPDATE Purchcases
app.put('/list/:id', (req, res) => {
    // basic validation
    if (!req.params.id) {
        return res.status(400).send({ message: 'ID is required' });
    }
    if (!req.body.description) {
        return res.status(400).send({ message: 'Description is required' });
    }
    if (!req.body.isDone) {
        return res.status(400).send({ message: 'Description is required' });
    }
    if (!req.body.id_set) {
        return res.status(400).send({ message: 'Id_set is required' });
    }
    // update a Sets
    const request = new sql.Request();
    request.input('id', req.params.id);
    request.input('description', req.body.description);
    request.input('isDone', req.body.isDone || false);
    request.input('id_set', req.body.id_set);
    request.query('UPDATE Purchases SET description=@description, isDone=@isDone, id_set=@id_set WHERE id = @id', (err, result) => {
        if (err) {
            res.status(500).send({ message: err.message });
        } else {
            res.json(result);
        }
    });
});

module.exports = router;

app.listen(process.env.PORT || 80);