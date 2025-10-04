const languageCode = "fr";

let greeting;

if(languageCode === "es") {
    greeting = 'Hola, Mundo';

}else if (languageCode === 'fr') {
    greeting = 'Bonjour, le monde';

} else if (languageCode === 'de') {
    greeting = 'Hallo, Welt';

} else {
    greeting = 'Hello, World';
}

console.log(greeting);

console.log("-------------Switch Statements------------");

switch(languageCode) {
    case "es":
      greeting = 'Hola, Mundo';
      break;

    case "fr":
       greeting = 'Bonjour, le monde';
       break;

    case "de":
        greeting = 'Hallo, Welt'; 
        break;
    default:
      greeting = 'Hello, World';
}

console.log(greeting);