example of req.body = {
"name": "rocky",
"contact": "90777",
"society": [
"theatre",
"cycling"
],
"year": 14,
"subjects": [
"xyz",
"yzx"
],
"class": "science"
}

- a student can be in one and only one class and its required
- society is optional
- there is no relation between socity and class directly
- the aggregrate function is in models/student.js with comments
- 2nd aggregrate functiom one return students as there were not written that is should return number of
- I made three routes one to add student and to for aggregrate function
- I could have make the route to get the value of class or society dynamic but i didn't have time
- class should be predefined in database if you want to add student in the class, society get created automatic on student adding with diffrent spciety name which is not in db
