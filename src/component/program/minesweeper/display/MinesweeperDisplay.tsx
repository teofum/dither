import React from 'react';

import ms_digit_0 from '../../../../assets/ui/mine/num0.png';
import ms_digit_1 from '../../../../assets/ui/mine/num1.png';
import ms_digit_2 from '../../../../assets/ui/mine/num2.png';
import ms_digit_3 from '../../../../assets/ui/mine/num3.png';
import ms_digit_4 from '../../../../assets/ui/mine/num4.png';
import ms_digit_5 from '../../../../assets/ui/mine/num5.png';
import ms_digit_6 from '../../../../assets/ui/mine/num6.png';
import ms_digit_7 from '../../../../assets/ui/mine/num7.png';
import ms_digit_8 from '../../../../assets/ui/mine/num8.png';
import ms_digit_9 from '../../../../assets/ui/mine/num9.png';
import ms_digit_minus from '../../../../assets/ui/mine/num-minus.png';
import './MinesweeperDisplay.css';

const dImgs = [
  ms_digit_0,
  ms_digit_1,
  ms_digit_2,
  ms_digit_3,
  ms_digit_4,
  ms_digit_5,
  ms_digit_6,
  ms_digit_7,
  ms_digit_8,
  ms_digit_9,
  ms_digit_minus
];

function MinesweeperDisplay(props: { value: number }) {
  const digits = [
    props.value < 0 ? 10 : ~~((props.value / 100) % 10),
    ~~((Math.abs(props.value) / 10) % 10),
    ~~(Math.abs(props.value) % 10)
  ];
  
  return (
    <div className='mined-root bevel light inset'>
      {digits.map((d, i) => (
        <img key={i} src={dImgs[d]} alt={d.toString()} />
      ))}
    </div>
  );
} 

export default MinesweeperDisplay;