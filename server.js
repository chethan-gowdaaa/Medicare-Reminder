const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');

// 🛠️ Force Node to use Google DNS to bypass router blocks!
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const PORT = process.env.PORT || 3000;

// 💾 YOUR CLEAN CLOUD DATABASE LINK
const MONGO_URI = "mongodb+srv://chethangowdaaa3006_db_user:CHEVIKA3006@cluster0.lxph160.mongodb.net/medicare?appName=Cluster0";

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Connect securely to MongoDB Atlas Cloud
mongoose.connect(MONGO_URI)
    .then(() => console.log("💾 Successfully connected to MongoDB Atlas Cloud Database!"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Define User Database Schema
const UserSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    dob: String,
    contact: String,
    gmail: String,
    userId: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Define Reminder/Medicine Schedule Schema
const ReminderSchema = new mongoose.Schema({
    userId: String,
    medicineName: String,
    dosage: String,
    reminderTime: String,
    lastTriggered: { type: String, default: "" }
});
const Reminder = mongoose.model('Reminder', ReminderSchema);

// ROUTE HANDLERS FOR PWA DEPLOYMENT MAPPING ASSIGNMENTS
app.get('/sw.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'sw.js'));
});

app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'manifest.json'));
});

// AUTH REGISTRATION
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, age, gender, dob, contact, gmail, userId, password } = req.body;
        
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ error: "Username configuration string identity already taken!" });
        }

        const newUser = new User({ name, age, gender, dob, contact, gmail, userId, password });
        await newUser.save();
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Server registration error" });
    }
});

// AUTH LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await User.findOne({ userId, password });
        
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials entered!" });
        }

        res.json({ success: true, profile: user });
    } catch (err) {
        res.status(500).json({ error: "Server login error" });
    }
});

// GET TRACKED PILLS
app.get('/api/reminders', async (req, res) => {
    try {
        const userReminders = await Reminder.find({ userId: req.query.userId });
        res.json(userReminders);
    } catch (err) {
        res.status(500).json({ error: "Error fetching reminders" });
    }
});

// SAVE NEW REMINDER
app.post('/api/reminders', async (req, res) => {
    try {
        const { userId, medicineName, dosage, reminderTime } = req.body;
        const newReminder = new Reminder({
            userId,
            medicineName,
            dosage,
            reminderTime,
            lastTriggered: ""
        });
        await newReminder.save();
        res.status(201).json(newReminder);
    } catch (err) {
        res.status(500).json({ error: "Error saving reminder" });
    }
});

// 🔥 DELETE UNWANTED MEDICINE REMINDER FROM MONGO CLOUD
app.delete('/api/reminders/:id', async (req, res) => {
    try {
        const reminderId = req.params.id;
        const deletedItem = await Reminder.findByIdAndDelete(reminderId);
        
        if (!deletedItem) {
            return res.status(404).json({ error: "Medicine item layout not found!" });
        }
        
        res.status(200).json({ message: "Reminder deleted successfully from database grid!" });
    } catch (err) {
        console.error("Error breaking entry:", err);
        res.status(500).json({ error: "Error deleting tracking database configuration" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Node architecture listening live at port: ${PORT}`);
});