import { faBackspace, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const Calculator = () => {
  const [equa, setEqua] = useState([]);
  const [cval, setCval] = useState("0");
  const [err, setErr] = useState(null);
  const [hist, setHist] = useState([]);

  const action = (event) => {
    const btn = event.target.dataset.ch;
    let val = cval;
    let updatedEqua = [...equa];

    switch(btn) {
      case 'CE':
        setCval('0');
        setErr(null);
        break;
      case 'C':
        setCval('0');
        setEqua([]);
        setErr(null);
        break;
      case 'back':
        val = val.slice(0, -1);
        if (val === '') val = '0';
        setCval(val);
        break;
      case '=':
        try {
          const result = eval(equa.join('') + val);
          setCval(result.toString());
          setEqua([]);
          setHist([...hist, [...equa, val, '=', result]]);
          if (hist.length > 3) {
            hist.pop();
          }
        } catch(error) {
          setErr('Invalid Expression');
        }
        break;        
      default:
        if (err !== null) {
          setErr(null);
        }
        if ((btn >= '0' && btn <= '9') || btn === '.') {
          if (val === '0' || err !== null) {
            setCval(btn);
          } else {
            setCval(val + btn);
          }
        } else {
          if (val !== '0') {
            updatedEqua.push(val);
          }
          updatedEqua.push(btn);
          setEqua(updatedEqua);
          setCval('0');
        }
        break;
    }
  };

  return (
    <div className="windowScreen flex flex-col bg-primary text-text-base" data-dock="true">
      <div className="flex pt-2">
        <div className="flex pl-2 items-center">
          <FontAwesomeIcon icon={faBars} className="text-gray-300" />
          <div className="mx-4 font-semibold pb-1">Standard</div>
        </div>
      </div>
      <div className="bg-primary-light h-full flex-grow flex">
        <div className="w-full flex-grow flex flex-col relative">
          <div className="valCont w-full bg-black p-4">
            <div className="eqCont text-2xl">
              {equa.join(' ')}
            </div>
            <div className="vlcCont text-4xl">{err === null ? cval : err}</div>
          </div>
          <div className="msrVal bg-gray-700 p-2">
            <div className="grid grid-cols-5 gap-2">
              <div className="cursor-pointer">MC</div>
              <div className="cursor-pointer">MR</div>
              <div className="cursor-pointer">M+</div>
              <div className="cursor-pointer">M-</div>
              <div className="cursor-pointer">MS</div>
            </div>
          </div>
          <div className="p-2 grid grid-cols-2 gap-2">
            <div className="grid grid-cols-4 gap-2">
              <div onClick={action} className="oper" data-ch="7">7</div>
              <div onClick={action} className="oper" data-ch="8">8</div>
              <div onClick={action} className="oper" data-ch="9">9</div>
              <div onClick={action} className="oper" data-ch="/">/</div>
              <div onClick={action} className="oper" data-ch="4">4</div>
              <div onClick={action} className="oper" data-ch="5">5</div>
              <div onClick={action} className="oper" data-ch="6">6</div>
              <div onClick={action} className="oper" data-ch="*">x</div>
              <div onClick={action} className="oper" data-ch="1">1</div>
              <div onClick={action} className="oper" data-ch="2">2</div>
              <div onClick={action} className="oper" data-ch="3">3</div>
              <div onClick={action} className="oper" data-ch="-">-</div>
              <div onClick={action} className="oper" data-ch="0">0</div>
              <div onClick={action} className="oper" data-ch=".">.</div>
              <div onClick={action} className="oper" data-ch="+">+</div>
              <div onClick={action} className="oper" data-ch="+-">+/-</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div onClick={action} className="oper" data-ch="%">%</div>
              <div onClick={action} className="oper" data-ch="CE">CE</div>
              <div onClick={action} className="oper" data-ch="C">C</div>
              <div onClick={action} className="oper" data-ch="back">
                <FontAwesomeIcon icon={faBackspace} />
              </div>
              <div onClick={action} className="oper" data-ch="inv">1/x</div>
              <div onClick={action} className="oper opow" data-ch="sq">x<sup className="text-xss">2</sup></div>
              <div onClick={action} className="oper opow" data-ch="sqrt">
                <sup className="text-xss">2</sup>√x
              </div>
              <div onClick={action} className="oper" data-ch="=">=</div>
            </div>
          </div>
        </div>
        <div className="calcHis flex flex-col bg-gray-700 p-4">
          <div className="text-sm font-semibold">History</div>
          {hist.length !== 0 ? null : (
            <div className="text-xs mt-4">There's no history yet</div>
          )}
          <div className="histCont win11Scroll">
            <div className="hct h-max flex-grow">
              {hist.map((his, index) => (
                <div key={index} className="flex flex-col items-end mb-6 text-gray-500">
                  {his.slice(0, 4).map((item, i) => (
                    <span key={i}>{item} </span>
                  ))}
                  <div className="text-2xl text-gray-600">{his[4]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;