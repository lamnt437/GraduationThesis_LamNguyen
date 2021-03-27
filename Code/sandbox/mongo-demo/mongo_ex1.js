
const mongoose = require('mongoose');

// connect to mongo
mongoose.connect("mongodb://localhost:27017/mongo-exercises", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log(err));

// schema
const courseSchema = mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: Number
});

// model
const Course = mongoose.model('Course', courseSchema);


// query
// const courses = Course
//     .find({ isPublished: true, tags: 'backend' })
//     .sort({ name: 1 })
//     .select({ name: 1, author: 1 })
//     .then(results => console.log(results));

// how to structure code the SOLID way
// single responsibility
// get courses
async function getCourses() {
    return await Course
        .find({ isPublished: true, tags: 'backend' })
        .sort({ name: 1 })
        .select({ name: 1, author: 1 })
}
// run and display

async function run() {
    const courses = await getCourses();
    console.log(courses)
}

run();