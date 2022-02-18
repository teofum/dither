import bayerThreshold4 from './threshold/bayerThreshold4';
import bayerThreshold8 from './threshold/bayerThreshold8';
import blueNoiseThreshold16 from './threshold/blueNoiseThreshold16';
import blueNoiseThreshold64 from './threshold/blueNoiseThreshold64';
import halftoneThreshold4 from './threshold/halftoneThreshold4';
import halftoneThreshold6 from './threshold/halftoneThreshold6';
import halftoneThreshold8 from './threshold/halftoneThreshold8';

const thresholds = [
  bayerThreshold8,
  bayerThreshold4,
  blueNoiseThreshold64,
  blueNoiseThreshold16,
  halftoneThreshold8,
  halftoneThreshold6,
  halftoneThreshold4
];

export default thresholds;