import React, { useEffect, useRef, useState } from 'react';

interface DatePickerProps {
    shown: boolean;
    setShown: (prev: boolean) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ shown, setShown }) => {
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
                setShown(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [setShown]);

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  
    return (
        <div
            ref={datePickerRef}
            className={`${
                shown ? 'scale-100 pointer-events-auto z-50' : 'scale-0 pointer-events-none'
            } transition-transform duration-200 absolute backdrop-blur-lg w-1/5 mx-20 mb-20 right-0 origin-bottom p-4 rounded shadow-lg`}
            style={{ bottom: 0, backdropFilter: 'blur(20px)', color: 'white' }}
        >
            {/* Calendar UI to be implemented here */}
            <div className="calendar-header">
                <button className="prev-month">❮</button>
                <span className="current-month">{`${weekday[new Date().getDay()]}, ${month[new Date().getMonth()]} ${new Date().getDate()} `}</span>
                <button className="next-month">❯</button>
            </div>
            <div className="calendar-grid">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                {/* Generate days here */}
                {[...Array(30).keys()].map(day => (
                    <div key={day} className="calendar-day">{day + 1}</div>
                ))}
            </div>
        </div>
    );
}

export default DatePicker;