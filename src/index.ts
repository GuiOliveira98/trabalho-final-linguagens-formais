import { Language, loadLanguageDataFromFile, saveLanguageToFile } from "./file";

function main() {
  const language = loadLanguageDataFromFile("example_file.txt");
  simplifyLanguage(language);
  saveLanguageToFile(language, "out.txt");
}

function simplifyLanguage(language: Language) {
  // remove transformations that dont use language symbols
  language.transformations = language.transformations.filter((transformation) =>
    language.symbols.includes(transformation.symbol)
  );

  let statesReachableFromInitialState = [language.initialState];
  let extraStates = [];
  do {
    extraStates = [];
    extraStates = language.transformations
      .filter((transformation) =>
        statesReachableFromInitialState.includes(transformation.state)
      )
      .filter(
        (transformation) =>
          !statesReachableFromInitialState.includes(transformation.nextState)
      )
      .map((transformation) => transformation.nextState);

    statesReachableFromInitialState = statesReachableFromInitialState.concat(
      extraStates
    );
  } while (extraStates.length > 0);

  // remove transformations unreachable from from initial state
  language.transformations = language.transformations.filter(
    (transformation) =>
      statesReachableFromInitialState.includes(transformation.state) &&
      statesReachableFromInitialState.includes(transformation.nextState)
  );

  let statesReachableFromFinalStates = [...language.finalStates];
  let additionalStates = [];
  do {
    additionalStates = [];
    additionalStates = language.transformations
      .filter((transformation) =>
        statesReachableFromFinalStates.includes(transformation.nextState)
      )
      .filter(
        (transformation) =>
          !statesReachableFromFinalStates.includes(transformation.state)
      )
      .map((transformation) => transformation.state);

    statesReachableFromFinalStates = statesReachableFromFinalStates.concat(
      additionalStates
    );
  } while (additionalStates.length > 0);

  // remove transformations unreachable from from final state
  language.transformations = language.transformations.filter(
    (transformation) =>
      statesReachableFromFinalStates.includes(transformation.state) &&
      statesReachableFromFinalStates.includes(transformation.nextState)
  );
}

main();
