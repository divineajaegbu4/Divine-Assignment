import express from 'express';

const app = express();
app.use(express.json());

let studentNames = [
        {
            id: 1,
            name: "Ikechukwu Agu",
            gender: "male"
        },
        {
            id: 2,
            name: "Onyenso Goodluck",
            gender: "chicken"
        },
        {
            id: 3,
            name: "Divine Ajaegbu",
            gender: "female"
        },
        {
            id: 4,
            name: "Joshua ....",
            gender: "Eats Alone"
        }
    ];

app.get("/hello", (req, res) => {
    res
        .status(200)
        .json({
            name: "Shedrack Ajaegbu"}
        );
});

app.get("/students/names", (req, res) => {
    

    res.status(200).json(studentNames);
});

app.delete("/students/names/:studentId", (req, res) => {
    let studentId = req.params.studentId;

    if (!studentId) {
        return res.status(400).json({message: "Invalid request. Student ID is a required path parameter."});
    }

    if (isNaN(Number(studentId))) {
        return res.status(400).json({message: "Student ID must be a number."});
    }

    studentId = Number(studentId);

    studentNames = studentNames.filter(student => student.id !== studentId);

    res.status(200).json({message: `Student with an ID, ${studentId}, was deleted successfully!`});
});

app.post("/students/names", (req, res) => {
    const newStudent = req.body;

    newStudent.id = studentNames.length + 1;

    studentNames.push(newStudent);

    res.status(201).json(newStudent);
});

app.patch("/students/names/:studentId", (req, res) => {
    const { name } = req.body;
    const studentId = req.params.studentId;

    const student = studentNames.find(stu => stu.id === Number(studentId));    

    student.name = name;

    studentNames = studentNames.filter(stu => stu.id !== studentId);

    studentNames.push(student);

    res.status(200).json(student);
})


const port = 2309;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));