import { readFileSync } from "fs";
import scanf from "scanf";
import { Language, Transformation } from "./language";

export const color = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

export function tint(logColor: string, message: string) {
  return logColor + message + color.Reset;
}

export function pressEnterToContinue() {
  console.log("\nPressione ENTER para continuar...");
  scanf("%s");
}

export function logLanguage(language: Language) {
  console.log(`Nome: ${tint(color.FgYellow, language.name)}
Símbolos: [${language.symbols
    .map((state) => tint(color.FgCyan, state))
    .join(",")}]
Estado inicial: ${tint(color.FgGreen, language.initialState)}
Estado finais: [${language.finalStates
    .map((state) => tint(color.FgGreen, state))
    .join(",")}]
Estados: [${language.states
    .map((state) => tint(color.FgGreen, state))
    .join(",")}]
Transformações:\n${language.transformations
    .map(makeTransformation)
    .join("\n")}`);
}

export function makeTransformation(transformation: Transformation) {
  return `${tint(color.FgYellow, transformation.state)}=(${tint(
    color.FgCyan,
    transformation.symbol
  )})=>${tint(color.FgGreen, transformation.nextState)}`;
}

export function readFilePrompt() {
  while (true) {
    process.stdout.write("Nome do arquivo: ");
    const filename = scanf("%s").replace("\r", "");
    const filePath = `${process.cwd()}/${filename}`;
    try {
      const fileData = readFileSync(filePath, "utf-8");
      return fileData;
    } catch {
      console.log(
        tint(
          color.FgRed,
          `ERRO: Nenhum arquivo encontrado em ${filePath}${color.Reset}`
        )
      );
      console.log("Tente outro nome de arquivo.\n");
      continue;
    }
  }
}

/*
Código por:
Guilherme Oliveira - 278301
Ronald Maciel - 281987
Camila Maffi - 243691
*/
