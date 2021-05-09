import scanf from "scanf";
import { decodeLanguageFromFileData } from "./file";
import { filterPairOfWords, processWord, minimizeLanguage } from "./language";
import {
  color,
  logLanguage,
  makeTransformation,
  pressEnterToContinue,
  readFilePrompt,
  tint,
} from "./userInterface";

function main() {
  console.clear();
  console.log("Olá!");

  while (true) {
    console.log("Digite o nome do arquivo que contenha uma linguagem.");
    console.log(`(Você está rodando esse programa na pasta "${process.cwd()}"`);
    const fileData = readFilePrompt();

    console.clear();
    process.stdout.write("Decodificando arquivo...");
    const language = decodeLanguageFromFileData(fileData);
    console.log(tint(color.FgGreen, "OK!"));

    console.log("");
    logLanguage(language);

    pressEnterToContinue();

    console.clear();
    process.stdout.write("Minimizando linguagem...");
    const change = minimizeLanguage(language);
    console.log(tint(color.FgGreen, "OK!"));

    console.log("");

    for (const symbol of change.symbolsWithNoTransformations) {
      console.log(
        `Removeu o símbolo ${tint(
          color.FgCyan,
          symbol
        )} pois a linguagem não possui transformações para ele.`
      );
    }

    for (const transformation of change.transformationsWithInvalidSymbols) {
      console.log(
        `Removeu ${makeTransformation(transformation)} pois ${tint(
          color.FgCyan,
          transformation.symbol
        )} é um símbolo inválido.`
      );
    }

    for (const transformation of change.unreachableFromInitialState) {
      console.log(
        `Removeu ${makeTransformation(transformation)} pois ${tint(
          color.FgCyan,
          transformation.symbol
        )} pois o estado inicial não possui caminho até um dos estados.`
      );
    }

    for (const transformation of change.finalStateUnreachable) {
      console.log(
        `Removeu ${makeTransformation(transformation)} pois ${tint(
          color.FgCyan,
          transformation.symbol
        )} pois um dos estados não possui caminho para nenhum estado final.`
      );
    }

    console.log("");
    logLanguage(language);

    pressEnterToContinue();

    while (true) {
      console.clear();
      logLanguage(language);
      console.log("");
      console.log("Selecione uma opção:");
      console.log("1 - Checa se uma palavra pertence à linguagem");
      console.log(
        "2 - Filtra pares de palavra não pertencentes à linguagem de um arquivo"
      );
      console.log("3 - Trocar de linguagem");
      process.stdout.write("Opção: ");
      const option = scanf("%d");

      if (option !== 1 && option !== 2 && option !== 3) {
        console.log("\n" + tint(color.FgRed, "Opção inválida."));
        pressEnterToContinue();
        continue;
      }

      if (option === 1) {
        console.clear();
        process.stdout.write("Digite uma palavra: ");
        const word = scanf("%s").replace("\r", "");
        const result = processWord(word, language);

        console.log("");
        result.transformations.map((transformation) =>
          console.log(makeTransformation(transformation))
        );
        console.log("");
        if (result.isAccepted) {
          console.log(tint(color.FgGreen, "PALAVRA ACEITA!"));
        } else {
          console.log(tint(color.FgRed, "PALAVRA NÃO ACEITA!"));
          console.log(
            `Motivo: ${
              result.failedReason === "state_is_not_final"
                ? "Último estado não é final"
                : "Transformação não definida para o símbolo lido no estado atual."
            }`
          );
        }

        pressEnterToContinue();
      } else if (option === 2) {
        console.clear();
        console.log("Digite o nome de arquivo de entrada.");
        const fileData = readFilePrompt();

        const pairOfWords = filterPairOfWords(fileData, language);

        console.log(tint(color.FgRed, "\nPares rejeitados"));
        if (pairOfWords.rejectedPairs.length === 0) {
          console.log("[Nenhuma]");
        } else {
          for (const pair of pairOfWords.rejectedPairs) {
            console.log(`(${pair[0]}, ${pair[1]})`);
          }
        }

        console.log(tint(color.FgGreen, "\nPares aceitos"));
        if (pairOfWords.acceptedPairs.length === 0) {
          console.log("[Nenhuma]");
        } else {
          for (const pair of pairOfWords.acceptedPairs) {
            console.log(`(${pair[0]}, ${pair[1]})`);
          }
        }

        pressEnterToContinue();
      } else if (option === 3) {
        console.clear();
        break;
      }
    }
  }
}

main();

/*
Código por:
Guilherme Oliveira - 278301
Ronald Maciel - 281987
Camila Maffi - 243691
*/
