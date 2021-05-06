import { loadLanguageDataFromFile } from "./file";

function main() {
  const language = loadLanguageDataFromFile("example_file.txt");
  console.log(language);
}

main();
