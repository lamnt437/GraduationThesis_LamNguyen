const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/playground')
mongoose.connect("mongodb+srv://lamnt:lam151098@devconnector.m0cdq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB database..."))
    .catch(err => console.log("Could not connect to MongoDB", err));

// Schema
const courseSchema = mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
})

// Model

const Course = mongoose.model('Course', courseSchema);
const course = new Course({
    name: 'Angular Course',
    author: 'Mosh',
    tags: ['angular', 'frontend'],
    isPublished: true
})

async function createCourse() {
    const result = await course.save();
    console.log(result)
}

async function getCourse() {
    const courses = await Course.find({author: 'Mosh', isPublished: true});
    console.log(courses);
}

// createCourse();
getCourse();

