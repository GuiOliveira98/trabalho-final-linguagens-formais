import { Language, Transformation } from "./language";

export function decodeLanguageFromFileData(fileData: string): Language {
  const lines = fileData.split("\n");

  const firstLine = lines.shift(); //PopFront()

  // AUTÔMATO [=] ({q0,q1,q2,q3},{a,b},Prog,q0,{q1,q3})
  const [name, propsWithParenthesis] = firstLine.split("=");

  // [(] {q0,q1,q2,q3},{a,b},Prog,q0,{q1,q3} [)]
  const props = propsWithParenthesis.replace("(", "").replace(")", ""); // Remove ()

  // {q0,q1,q2,q3 [}] ,{a,b},Prog,q0,{q1,q3}
  const firstCloseBracket = props.indexOf("}");
  const allStatesString = props
    .substring(0, firstCloseBracket)
    .replace("{", "");

  // q0 [,] q1 [,] q2 [,] q3
  const states = allStatesString.split(",");

  // {q0,q1,q2,q3 >}< ,{a,b [}] ,Prog,q0,{q1,q3}
  const secondCloseBracket = props.indexOf("}", firstCloseBracket + 1);
  const allSymbolsString = props
    .substring(firstCloseBracket + 1, secondCloseBracket)
    .replace(",{", "");

  // a [,] b
  const symbols = allSymbolsString.split(",");

  // {q0,q1,q2,q3},{a,b >}< ,Prog [,] q0,{q1,q3}
  const fourthArgSeparator = props.indexOf(",", secondCloseBracket + 2);
  const productionName = props.substring(
    secondCloseBracket + 2,
    fourthArgSeparator
  );

  // {q0,q1,q2,q3},{a,b},Prog >,< q0 [,] {q1,q3}
  const fifthArgSeparator = props.indexOf(",", fourthArgSeparator + 1);
  const initialState = props.substring(
    fourthArgSeparator + 1,
    fifthArgSeparator
  );

  // {q0,q1,q2,q3},{a,b},Prog,q0 >,< {q1,q3} []
  const finalStates = props
    .substring(fifthArgSeparator + 1)
    .replace("{", "")
    .replace("}", "")
    .split(",");

  lines.shift(); // Prog

  const transformations: Transformation[] = [];
  for (const line of lines) {
    // (q0,a) [=] q1
    const [leftMatch, nextState] = line.split("=");

    // [(] q0 [,] a [)]
    const [state, symbol] = leftMatch
      .replace("(", "") // remove (
      .replace(")", "") // remove )
      .split(",");

    transformations.push({ nextState, state, symbol });
  }

  return {
    name,
    symbols,
    productionName,
    states,
    initialState,
    finalStates,
    transformations,
  };
}

/*
Código por:
Guilherme Oliveira - 278301
Ronald Maciel - 281987
Camila Maffi - 243691
*/
