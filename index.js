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

app.post('/user/signup',(req,res) => {
    const user = {
        username : req.body.username,
        password : req.body.password,
        purchasedCourses : [],
    }
    const ExistingUser = USER.find(u => u.username === user.username);
    if(ExistingUser){
        res.status(403).json({message : "User already exists"});
    }
    else
    {
        USER.push(user);
        res.status(200).json({message : 'User created'});
    }

})

app.post('/user/login', userAuthentication, (req, res) => {
    const { username, password } = req.body;
    const user = USER.find(a => a.username === username);

    if (!user) {
        res.status(403).json({ message: 'Admin not found' });
        return;
    }

    if (user.password !== password) {
        res.status(403).json({ message: 'Incorrect password' });
        return;
    }
    res.json({ message: 'Logged in successfully' });
});

app.post('/user/courses',userAuthentication, (req,res) => {
    let filteredCourses = [];
    for(let i=0; i<COURSE.length; i++)
    {
        if(COURSE[i].published)
        {
            filteredCourses.push(COURSE[i]);
        }
    }
    res.json({ course : filteredCourses});
})



app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`)
})