import floydSteinberg from './edmatrix/floydSteinberg';
import minAverageError from './edmatrix/minAverageError';
import sierra from './edmatrix/sierra';
import simple from './edmatrix/simple';
import stucki from './edmatrix/stucki';

const edMatrices = [
  floydSteinberg,
  minAverageError,
  stucki,
  sierra,
  simple
];

export default edMatrices;