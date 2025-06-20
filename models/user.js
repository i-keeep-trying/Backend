// Import mongoose
const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,          // The name must be a string
    required: true,        // This field is mandatory
    trim: true,            // Removes extra spaces from the name
  },
  email: {
    type: String,          // The email must be a string
    required: true,        // This field is mandatory
    unique: true,          // Ensures no two users have the same email
    lowercase: true,       // Converts the email to lowercase automatically
  },
  age: {
    type: Number,          // The age must be a number
    min: 0,                // Ensures the age is not negative
    max: 120,              // Sets a maximum age limit
  },
  isAdmin: {
    type: Boolean,         // A boolean indicating admin status
    default: false,        // Default value is false
  },
  createdAt: {
    type: Date,            // Stores the creation date
    default: Date.now,     // Automatically sets the current date
  },
});

// Create the User Model
const User = mongoose.model('User', userSchema);

// Export the model for use in other files
module.exports = User;
