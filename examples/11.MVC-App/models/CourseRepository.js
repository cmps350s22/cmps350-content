import fetch from 'node-fetch';

class CourseRepository {
    async getPrograms() {
        const data = await fetch('https://cmps356s17.github.io/data/ceng-programs.json')
        return await data.json()
    }

    async getCourses(program) {
        const data = await fetch('https://cmps356s17.github.io/data/ceng-courses.json')
        let courses = await data.json()

        return courses.filter(c => c.program === program.toUpperCase())
    }
}

export default new CourseRepository();
