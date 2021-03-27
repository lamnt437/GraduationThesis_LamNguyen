const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to database'))
    .catch(err => console.log(err));

const courseSchema = mongoose.Schema({
    name: String,
    tags: [ String ],
    author: String,
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: Number
})

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
    return await Course
        .find({isPublished: true})
        .or([{tags: 'frontend'}, {tags: 'backend'}])
        .sort({price: -1})
        .select({name: 1, author: 1})
}

async function run() {
    const courses = await getCourses();
    console.log(courses);
}

try {
    run()
} catch(error) {
    console.log(error);
}