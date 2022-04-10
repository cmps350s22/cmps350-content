const coursesTemplate = `
    <ul>
        {{#courses}}
            <li>{{code}} - {{name}}</li>
        {{/courses}}
    </ul>`;

//When the document is loaded in the browser then listen to programsDD on change event
document.addEventListener("DOMContentLoaded", () => {
    const regionDD = document.querySelector('#programsDD');
    regionDD.addEventListener('change', onProgramChange);
});

async function getCouses(programCode) {
    const url = `/api/courses/${programCode}`
    const response = await fetch(url)
    return await response.json()
}

async function onProgramChange() {
    const regionDD = document.querySelector('#programsDD');
    const coursesList = document.querySelector('#courses-list');
    const programCode = regionDD.value;
    if (programCode == "") {
        coursesList.innerHTML = "";
        return
    }

    console.log("onProgramChange.programCode:", programCode)

    try {
        const courses = await getCouses(programCode);

        const htmlTemplate = Handlebars.compile(coursesTemplate);
        const htmlContent = htmlTemplate( { courses } );

        coursesList.innerHTML = htmlContent;
    }
    catch (err) {
        console.log(err);
    }
}
