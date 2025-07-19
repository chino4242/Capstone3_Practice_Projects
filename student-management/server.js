const express = require("express");
const app = express()

const mongoose = require('mongoose');
const PORT = 3000;
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

const url = "mongodb://localhost:27017/students-db"
const connectToDatabase = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error);
    }
};

connectToDatabase();

const studentSchema = mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    gpa: Number,
    isPG: Boolean
})

const Student = mongoose.model('students_collection', studentSchema)

app.get("/", async (req, res) => {
    try {
        const students = await Student.find()
        console.log(JSON.stringify(students))
        return res.render("allStudents.ejs", { studentsList: students })
    }
    catch (err) {
        return res.send(`ERROR: with all endpoint - ${err}`)
    }
})


app.get("/addStudent", (req, res) => {
    return res.render("add-student-form")
})

app.post("/insert", async (req, res) => {

    let status = false;
    if (req.body.studentPGStatus === "yes") {
        status = true
    } else {
        status = false
    }

    const myEmail = `${req.body.studentName}@college.com`
    const studentInfo = {
        id: parseInt(req.body.studentId),
        name: req.body.studentName,
        email: myEmail,
        gpa: parseFloat(req.body.studentGPA),
        isPG: status
    }

    const studentToAdd = new Student(studentInfo)
    try {
        const savedStudent = await studentToAdd.save()

    } catch (err) {
        console.log(err)
    }

    return res.redirect("/")

})

app.get("/modify", async (req, res) => {
    try {
        const students = await Student.find()
        return res.render("modify-student-form.ejs", { students: students })
    }
    catch (err) {
        console.log(err)
    }
})

app.post("/change/:docId", async (req, res) => {

    try {
        await Student.findByIdAndUpdate(req.params.docId, { gpa: req.body.updatedGPA })
        return res.redirect("/")
    }
    catch {
        return res.send(`ERROR: Cannot find student with ${req.params.id}`)
    }


})

app.get("/removeStudent", async (req, res) => {

    try {
        const students = await Student.find()
        res.render("deleteStudent.ejs", { students: students })
    }
    catch (err) {
        return res.send(`ERROR: with all endpoint - ${err}`)
    }

})

app.post("/delete/:docId", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.docId)
        return res.redirect("/")
    }
    catch (err) {
        console.log(`ERROR: ${err}`)
    }

})

app.get("/search", (req, res) => {
    res.render("search-form")
})

app.post("/find", async (req, res) => {

    const results = await Student.find({ name: req.body.studentName })
    if (results.length === 0) {
        return res.send(`There are no matching students`)
    } else {
        return res.send(JSON.stringify(results))
    }
})
app.get("/details/:studentId", async (req, res) => {
    try {
        // Find student by their custom ID (not MongoDB's _id)
        const student = await Student.findOne({ id: parseInt(req.params.studentId) });
        
        if (!student) {
            return res.render("student-details.ejs", { 
                student: null, 
                error: "Student not found" 
            });
        }
        
        return res.render("student-details.ejs", { 
            student: student, 
            error: null 
        });
    } catch (err) {
        console.log(`ERROR: ${err}`);
        return res.render("student-details.ejs", { 
            student: null, 
            error: "Error retrieving student details" 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})