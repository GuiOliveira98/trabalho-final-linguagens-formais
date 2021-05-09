export type Transformation = {
  state: string;
  nextState: string;
  symbol: string;
};

export type Language = {
  name: string;
  symbols: string[];
  states: string[];
  productionName: string;
  initialState: string;
  finalStates: string[];
  transformations: Transformation[];
};

export function minimizeLanguage(language: Language) {
  const symbolsWithNoTransformations = language.symbols.filter(
    (symbol) =>
      language.transformations.find(
        (transformation) => transformation.symbol === symbol
      ) === undefined
  );

  // remove symbols with no transformations
  language.symbols = language.symbols.filter(
    (symbol) => !symbolsWithNoTransformations.includes(symbol)
  );

  const transformationsWithInvalidSymbols = language.transformations.filter(
    (transformation) => !language.symbols.includes(transformation.symbol)
  );

  // remove transformations that dont use language symbols
  language.transformations = language.transformations.filter(
    (transformation) =>
      !transformationsWithInvalidSymbols.includes(transformation)
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

  const unreachableFromInitialState = language.transformations.filter(
    (transformation) =>
      !statesReachableFromInitialState.includes(transformation.state) ||
      !statesReachableFromInitialState.includes(transformation.nextState)
  );

  // remove transformations unreachable from from initial state
  language.transformations = language.transformations.filter(
    (transformation) => !unreachableFromInitialState.includes(transformation)
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

  const finalStateUnreachable = language.transformations.filter(
    (transformation) =>
      !statesReachableFromFinalStates.includes(transformation.state) ||
      !statesReachableFromFinalStates.includes(transformation.nextState)
  );

  // remove transformations unreachable from from final state
  language.transformations = language.transformations.filter(
    (transformation) => !finalStateUnreachable.includes(transformation)
  );

  return {
    symbolsWithNoTransformations,
    transformationsWithInvalidSymbols,
    unreachableFromInitialState,
    finalStateUnreachable,
  };
}

export function processWord(
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

export function filterPairOfWords(fileData: string, language: Language) {
  const lines = fileData.split("\n");

  const acceptedPairs: string[][] = [];
  const rejectedPairs: string[][] = [];
  for (let line of lines) {
    line = line.replace("(", "").replace(")", "");
    const words = line.split(",");

    const processedWord1 = processWord(words[0], language);
    const processedWord2 = processWord(words[1], language);

    if (processedWord1.isAccepted && processedWord2.isAccepted) {
      acceptedPairs.push(words);
    } else {
      rejectedPairs.push(words);
    }
  }

  return { acceptedPairs, rejectedPairs };
}
