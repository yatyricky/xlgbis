import React, { useEffect, useState } from 'react';

export default ({ seconds, formatter, onCompleted }) => {
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        // exit early when we reach 0
        if (!timeLeft) {
            return onCompleted && onCompleted()
        }

        // save intervalId to clear the interval when the
        // component re-renders
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        // clear interval on re-render to avoid memory leaks
        return () => {
            clearInterval(intervalId)
        };
        // add timeLeft as a dependency to re-rerun the effect
        // when we update it
    }, [timeLeft]);

    return (
        <div>
            {formatter ? formatter.format(timeLeft) : timeLeft}
        </div>
    );
};
