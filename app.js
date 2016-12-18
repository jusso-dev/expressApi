const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');

const config = require('./conf');
router = express.Router();
const port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);
app.use(morgan('dev'));
    
// =======================
// configuration =========
// =======================
const RosterSchema = new mongoose.Schema({
  date: String,
  dayOfWeek: String,
  startTime: String,
  endTime: String,
  notes: String,
});
// =======================
// configuration =========
// =======================

const Roster = mongoose.model('Roster', RosterSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  try {
    res.status(200).json({message: "Please use /api/roster"});
  } catch (error) {
    res.status(500).json({message: "There was an error reaching api"})
  }
});

// GET

app.get('/api/rosters', (req, res) => {
  try {
    Roster.find(function (err, rosters) {
    if (err) return console.error(err);
    res.status(200).json(rosters)
  });

  } catch (error) {
    res.status(500).json({message: "There was an error fetching rosters"})
  }
});

// POST

app.post('/api/addroster', (req, res) => {
  try {
    let roster = new Roster({
      date: req.body.date,
      dayOfWeek: req.body.dayOfWeek,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      notes: req.body.notes
    });
    roster.save()
    return res.status(201).json({message: "Successfully Created"})
  } catch (error) {
res.status(500).json({message: "There was an error processing the request"})
   }
});

// PUT

app.put('/api/roster/:_id', (req, res) => {
	
  try {
    let id = req.params._id;
    let roster = req.body;
    
    Roster.findByIdAndUpdate(id, roster, (err, roster) => {
		if(err){
			throw err;
		}
		res.status(200).json({message: "Successfully Updated Roster"})
	});
    
  } catch (error) {
    res.status(500).json({message: "An error occured processing your request"})
  }
});

// DELETE

app.delete('/api/roster/:_id', (req, res) => {
  try {
    let id = req.params._id;
	  let roster = req.body;

    Roster.findOneAndRemove(id, roster, (err, roster) => {
		if(err){
			throw err;
		}
		res.status(200).json({message: "Successfully Deleted Roster"})
	});
  
  } catch (error) {
    res.status(500).json({message: "An error processing your request"})
 }
});

app.listen(port);