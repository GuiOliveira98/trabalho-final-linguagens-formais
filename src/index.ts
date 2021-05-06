import {
  Language,
  loadLanguageDataFromFile,
  saveLanguageToFile,
  Transformation,
} from "./file";

function main() {
  const language = loadLanguageDataFromFile("example_file.txt");
  console.log(processWord("bab", language));
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

function processWord(
  word: string,
  language: Language
): {
  isAccepted: boolean;
  failedReason?: "undefined_transformation" | "state_is_not_final";
  transformations: Transformation[];
} {
  let currentState = language.initialState;
  const transformations: Transformation[] = [];
  let transformation: Transformation | undefined;

  for (let step = 0; step < word.length; step++) {
    let symbol = word[step];

    transformation = language.transformations.find(
      (transformation) =>
        transformation.state === currentState &&
        transformation.symbol === symbol
    );

    if (transformation === undefined) {
      return {
        isAccepted: false,
        failedReason: "undefined_transformation",
        transformations,
      };
    }

    currentState = transformation.nextState;
    transformations.push(transformation);
  }

  if (!language.finalStates.includes(currentState)) {
    return {
      isAccepted: false,
      failedReason: "state_is_not_final",
      transformations,
    };
  } else {
    return { isAccepted: true, transformations };
  }
}

main();
