
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises', {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log(err));

const courseSchema = mongoose.Schema({
    name: String,
    tags: [ String ],
    author: String,
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
    return await Course
        .find({isPublished: true})
        .or([
            { price: { $gte: 15}}, 
            {name: /.*by.*/i}
        ]);
}

async function run() {
    const courses = await getCourses();
    console.log(courses);
}

run();