import formidable from "formidable";
import express from "express";
import { readFile, writeFile } from 'fs/promises'
import {fileURLToPath} from "url";

const app = express();

const currentUrl = new URL('./', import.meta.url);
const currentPath = fileURLToPath(currentUrl);
console.log("currentUrl: ", currentUrl.toString(), "currentPath: ", currentPath);

//Allow serving static files from the current folder
app.use( express.static(currentPath) );

app.get('/', function (req, res){
    res.sendFile(`${currentPath}/upload-example.html`);
});

app.post("/user-profile", (req, res) => {
    const formData = formidable({ multiples: true });

    formData.parse(req, async (err, fields, files) => {
        if (err) {
            return res.send("Something went wrong.");
        }
        const uploadedFiles = await saveFiles(files);
        fields.profilePhotos = uploadedFiles;
        saveUserDetails(fields);
        let content = uploadedFiles.map( file =>`<a href="${file}">${file}</a>` ).join('<br>');
        content = "<p>File saved successfully<p>" + content;
        res.send(content);
    });
});

const saveUserDetails = (userDetails) => {
    console.log(userDetails);
    console.log("User details saved successfully.");
};

const saveFiles = async (files) => {
    //const fileList = Object.keys(files);
    const uploadedFiles = [];
    console.log(files);
    if (Array.isArray(files.profilePhotos)) {
        for (let file of files.profilePhotos) {
            await saveFile(file);
            uploadedFiles.push(`/uploads/${file.name}`);
        }
    } else {
        await saveFile(files.profilePhotos);
        uploadedFiles.push(`/uploads/${files.profilePhotos.name}`);
    }

    return uploadedFiles;
};

const saveFile = async (file) => {
    const fileName = file.name;
    const fileContent = await readFile(file.path);
    await writeFile(`./uploads/${fileName}`, fileContent);
    return "file saved successfully.";
};

const port = 5000;
app.listen(port, () => {
    const host = "localhost";
    console.log(`App running @ http://${host}:${port}`);
});