const  studentDetails = {
    id: 123,
    firstname: "Abas",
    lastname: "Ibn Firas", program: "CS",
    get fullName() {
        return `${this.firstname} ${this.lastname}`;
    }
};

const  courses =
    {
        courses: [
            {
                courseCode: "CMPS151",
                couseName: "Progamming Concepts",
                creditHours: 3,
                semster: "Spring 2016",
                garde: "A"
            },
            {
                courseCode: "CMPS152",
                couseName: "Progamming Concepts Lab",
                creditHours: 1,
                semster: "Spring 2016",
                garde: "B"
            },
            {courseCode: "CMPS251", couseName: "OO Programming", creditHours: 3, semster: "Spring 2016", garde: "B+"},
            {courseCode: "CMPS252", couseName: "OO Programming Lab", creditHours: 1, semster: "Spring 2016", garde: "A"}
        ],

        get coursesCount() {
            return this.courses.length;
        }
    };

const  address = {
    street : "123 Amir St", city: "Doha", country: "Qatar",
    getAddress() {
        return `${this.street} ${this.city} ${this.country}`;
    }
};

// Merge multiple sources objects into a target empty object {}
// Notice the last object will override properties having the same name as the first object
const  student = Object.assign({}, studentDetails, courses, address,
                    {dob: "10/1/2000", hasCat: true});

console.log(student.fullName, student.getAddress(),
                "coursesCount: ", student.coursesCount);

const  movie1 = {
    name: 'Star Wars',
    episode: 7
};

//We clone movie 1 and override the episode property
const  movie2 = {...movie1, episode: 8, rating: 5 };
//Another way of doing the same using Object.assign
//const  movie2 = Object.assign({}, movie1, { episode: 8, rating: 5});

console.log('\n');
console.log(movie1.name, "movie1.episode: ", movie1.episode, " - Rating: ", movie1.rating); // writes 7
console.log(movie2.name, "movie2.episode: ", movie2.episode, " - Rating: ", movie2.rating); // writes 8