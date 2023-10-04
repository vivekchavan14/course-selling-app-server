const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

let ADMIN = [];
let USER = [];
let COURSE = [];

const adminAuthentication = (req, res, next) => {
    const {username , password} = req.headers;
    const admin = ADMIN.find(a => a.username === username && a.password === password);
    if(admin){
        next();
    }
    else
    {
        res.status(403).json({message : 'Admin authentication failed'});
    }
}

const userAuthentication = (req, res, next) => {
    const {username , password} = req.headers;
    const user = USER.find(a => a.username === username && a.password === password);
    if(user){
        next();
    }
    else
    {
        res.status(403).json({message : 'User authentication failed'});
    }
}

app.post('/admin/signup', (req,res) => {
    const admin = req.body;
    const existingAdmin = ADMIN.find(a => a.username === admin.username);
    if(existingAdmin)
    {
        res.status(403).json({message : 'Admin already exists'});
    }
    else
    {
        ADMIN.push(admin);
        res.json({message : 'Admin created successfully'});
    }
})

app.post('/admin/login', adminAuthentication, (req, res) => {
    const { username, password } = req.body;
    const admin = ADMIN.find(a => a.username === username);

    if (!admin) {
        res.status(403).json({ message: 'Admin not found' });
        return;
    }

    if (admin.password !== password) {
        res.status(403).json({ message: 'Incorrect password' });
        return;
    }

    res.json({ message: 'Logged in successfully' });
});

app.post('/admin/courses', adminAuthentication, (req,res)=>{
    const course = req.body;
    course.id = Math.floor(Math.random()*1000);
    COURSE.push(course);
    res.json({
        message : 'Course created successfully',
        courseId : course.id,
    })
})

app.put('/admin/courses/:courseId', adminAuthentication, (req,res)=>{
    const courseId = req.params.courseId;
    const course = COURSE.find(c => c.id === courseId);
    if(course)
    {
        Object.assign(course , req.body);
        res.json({message : 'Course updated successfully'});
    }
    else 
    {
        res.json({message : 'Course not found'})
    }
})

app.get('/admin/courses',(req,res)=>{
    res.json({course : COURSE})
})

app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`)
})