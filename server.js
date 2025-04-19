const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 4003;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registration', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create user schema
const userSchema = new mongoose.Schema({
  Emer: String,
  mbiemer: String,
  Email: String,
  Mosha: Number,
  Numri: Number,
  Eventet: Date,
  Biletat: String,
});

// Create model
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Handle form submission
app.post('/users', async (req, res) => {
  console.log('Data received:', req.body); // Log të dhënave që vijnë nga klienti
  const { Emer, mbiemer, Email, Mosha, Numri, Eventet, Biletat } = req.body;

  try {
    if (!Emer || !mbiemer || !Email || !Mosha || !Numri || !Eventet || !Biletat) {
      throw new Error("Të gjitha fushat janë të detyrueshme!");
    }

    const eventDate = new Date(Eventet);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time part

    if (eventDate < today) {
      throw new Error("Nuk mund të rezervoni për një datë të kaluar!");
    }

    const newUser = new User({
      Emer,
      mbiemer,
      Email,
      Mosha,
      Numri,
      Eventet: eventDate,
      Biletat
    });

    await newUser.save();

    res.status(200).json({ message: 'Rezervimi u regjistrua me sukses!' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Gabim gjatë regjistrimit!' });
  }
}); // <-- This closing bracket was missing!

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
