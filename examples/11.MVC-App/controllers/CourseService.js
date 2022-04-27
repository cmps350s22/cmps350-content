import courseRepository from './../models/CourseRepository.js';

class CourseService {
    async getProgramsJson(req, res) {
        const programs = await courseRepository.getPrograms();
        res.json(programs);
    }

    async getCoursesJson(req, res) {
        try {
            const program = req.params.program;
            console.log('getCourses.req.params.program', program);

            const courses = await courseRepository.getCourses( program );
            res.json(courses);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }

    async getCourses (req, res) {
        const programs = await courseRepository.getPrograms();
        //res.json(programs);
        const user = {firstname: "Foulan", lastname: "Ibn Foulan" };

        //Handle the case of post
        let courses;
        const selectedProgram = req.body.program;
        const studentId = req.body.studentId;
        if (selectedProgram)
            courses = await courseRepository.getCourses( selectedProgram );

        res.render('course', { programs, user, selectedProgram, studentId, courses });

        /*
        res.render('view', {
          title: 'my other page',
          layout: 'other'
        });

        res.render('view', {
              title: 'my other page',
              layout: false
            });
         */
    }
}

export default new CourseService();