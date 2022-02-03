let books = [
    {title: "Head First JavaScript", authors: ["Jhon Doe", "Mr Bean"]},
    {title: "JavaScript in Action", authors: ["Said Saad", "Cool Guy"]}
]
let authors = books.flatMap(b => b.authors);
console.log(authors);
