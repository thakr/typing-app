import {useState, useEffect} from "react";
import { motion } from "framer-motion";
import useKeyPress from '../useKeyPress';
const randomWords = require('random-words');
import { Dialog } from '@headlessui/react'

export default function Home() {
  
  // let phrase = 
  // let phraseArr = [];
  // for (let i = 0; i < phrase.length; i ++) {
  //   phraseArr.push(phrase[i]);
  // }
  const [charAt, setCharAt] = useState(0);
  const [incorrectLetter, setIncorrectLetter] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [wpm, setwpm] = useState(0);
  const [countdownSecs, setCountdownSecs] = useState(3);
  const [phraseArr, setPhraseArr] = useState([]);
  const [incorrectAmt, setIncorrectAmt] = useState(0);
  const [finished, setFinished] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [savedWPM, setSavedWPM] = useState(0);

  useEffect(() => {
    setCharAt(0);
    setIncorrectLetter(false);
    setSeconds(0);
    setWordsCompleted(0);
    setwpm(0);
    setIncorrectAmt(0);

    let randwords = randomWords({ min: 15, max: 50, join: ' ' })
    randwords += ".";
    randwords = randwords.charAt(0).toUpperCase() + randwords.slice(1);
    setPhraseArr(randwords.split(''))
  }, [finished])
  useEffect(() => {
    if (countdownActive) {
      countdownSecs > 0 ? setTimeout(() => setCountdownSecs(v => v - 1), 1000) : setTimeout(() => {
        setActive(true);
        setCountdownActive(false);
        setCountdownSecs(3);
      }, 500);
    }
    
  }, [countdownSecs, countdownActive])

  useEffect(() => {
    let interval = null;
    if (active) {
      interval = setInterval(() => {
        setSeconds(v => v + 1)
      }, 1000)
    } else if (!active && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [active, seconds])

  useEffect(() => {
    setwpm(wordsCompleted/seconds);
  }, [wordsCompleted, seconds])

  useKeyPress(key => {
    if (active) {
      if (key == phraseArr[charAt]) {
        if (key == " ") {
          setWordsCompleted(v => v + 1);
        }
        setIncorrectLetter(false);
        setCharAt(v => v+1);
      } else {
        !incorrectLetter && setIncorrectAmt(v => v + 1);
        setIncorrectLetter(true);
      }
    }
  })
  useEffect(() => {
    window.addEventListener('keyup', (key) => {
      if (key.key == "Enter") {
        setCountdownActive(true);
        setFinished(false);
      }
    });
  }, [])
  useEffect(() => {
    if (phraseArr.length > 0 && charAt == phraseArr.length) {
      setWordsCompleted(v => v + 1);
      setActive(false);
      setFinished(true);
      setSavedWPM(Math.round(wpm * 60));
    }
  }, [charAt, active])
  return (
    <div className="container flex items-center p-4 mx-auto min-h-screen justify-center">
      <motion.div className={`absolute flex w-[100%] h-[100%] items-center justify-center bg-blue-900 flex-col`} animate={countdownActive ? {opacity: 0.9} : {opacity: 0, display: 'none'}}>        
        <motion.h1 className={`font-bold text-6xl z-10 text-white opacity-0`} animate={countdownActive ? {opacity: 1} : {opacity: 0}}>{countdownSecs}</motion.h1>
      </motion.div>
      <motion.div className={`absolute flex flex-col w-[100%] h-[100%] items-center justify-center bg-blue-900 opacity-0 invisible`} animate={finished ? {visibility: "initial",opacity: 1} : {visibility: 'hidden',opacity:0}}>
        <h1 className={`font-bold text-4xl z-10 text-white mb-5`}>Nice job!</h1>
        <div className="bg-white rounded-lg shadow-lg w-96 mb-5 h-96 overflow-auto">
          <h1 className="font-bold text-xl mb-2 text-white p-4 bg-gray-900 overflow-hidden">Leaderboard</h1>
          <table className="mx-2" cellPadding={'10'}>
            <tr className="border-b-[1px] border-gray-500 text-left">
              <th className="w-[90%]">Name</th>
              <th>WPM</th>
            </tr>
            <tr className="border-b-[1px] border-gray-500">
              <td className="font-semibold">You</td>
              <td className="font-semibold">{savedWPM}</td>
            </tr>
            <tr className="border-b-[1px] border-gray-500">
              <td>Temp 1</td>
              <td>150</td>
            </tr>
            <tr className="border-b-[1px] border-gray-500">
              <td>Temp</td>
              <td>20</td>
            </tr>
          </table>
        </div>
        <motion.button className="bg-white shadow-lg text-xl py-1 px-5 rounded-3xl font-bold cursor-pointer border-white text-black border-2 hover:bg-transparent ease-in-out transition hover:text-white" onClick={() => {
          setCountdownActive(true);
          setFinished(false);
        }}>Play again</motion.button>
      <div>

      </div>
      </motion.div>
      <div className="w-2/3">
        <h1 className="font-mono text-xl code text-left">
        {phraseArr.length > 0 ? (
          phraseArr.map((v,i) => {
            return <span key={i} className={`font-semibold text-2xl ${(charAt == i ? "underline bg-blue-100" : "no-underline")} ${(charAt > i ? "text-blue-500" : incorrectLetter && charAt == i ? "text-red-500 line-through" :"text-gray-800")}`}>{v}</span>;
          })
        ) : <p>loading...</p>}
        </h1>
        <br />
        <div className="flex items-center justify-center">
          <motion.button animate={!active && !finished ? {opacity: 1} : {opacity: 0, display: "none"}} className="bg-blue-900 shadow-lg text-xl py-1 px-5 rounded-3xl font-bold cursor-pointer border-blue-900 text-white border-2 hover:bg-transparent ease-in-out transition hover:text-black" onClick={() => setCountdownActive(true)}>Play</motion.button>
        </div>
        {active && <p className="font-semibold text-gray-800">{Math.round(wpm * 60)} wpm</p>}
        {active && <p className="font-semibold text-gray-800">{100 - Math.round(incorrectAmt /  phraseArr.length * 100)}% accuracy</p>}
      </div>
    </div>
  )
}
