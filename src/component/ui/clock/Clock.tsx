import React, { useEffect, useState } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => {
      setTime(new Date());
    }, 5000);

    return () => clearInterval(tick);
  }, []);

   const hours = (time?.getHours() || 0)
    .toString()
    .padStart(2, '0');
   const minutes = (time?.getMinutes() || 0)
    .toString()
    .padStart(2, '0');

  return (
    <span>{`${hours}:${minutes}`}</span>
  );
}

export default Clock;