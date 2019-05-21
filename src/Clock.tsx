import React, { useState, useEffect } from "react";
import moment from "moment";

const useTimer = (callback: () => void, interval = 1000) => {
  useEffect(() => {
    const timer = setInterval(callback, interval);
    return () => {
      clearInterval(timer);
    };
  }, []);
};

export const Clock = (props: { className?: string }) => {
  const [time, setTime] = useState(new Date());

  useTimer(() => setTime(new Date()), 1000);

  return (
    <span className={props.className}>
      {moment(time).format("k:mm dddd D.M.YYYY")}
    </span>
  );
};
