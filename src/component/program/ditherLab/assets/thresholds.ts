import bayerThreshold4 from './threshold/bayerThreshold4';
import bayerThreshold8 from './threshold/bayerThreshold8';
import blueNoiseThreshold16 from './threshold/blueNoiseThreshold16';
import blueNoiseThreshold64 from './threshold/blueNoiseThreshold64';

const thresholds = [
  bayerThreshold8,
  bayerThreshold4,
  blueNoiseThreshold64,
  blueNoiseThreshold16
];

export default thresholds;