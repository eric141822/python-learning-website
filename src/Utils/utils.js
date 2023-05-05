import { word2index, LSTMword2index, finalWord2index } from "./Constants";
export function getTokenisedWord(seedWord) {
  // const _token = word2index[seedWord.toLowerCase()];
  const _token = LSTMword2index[seedWord.toLowerCase()];
  //   const _token = finalWord2index[seedWord.toLowerCase()];

  return _token ? _token : 0;
}
