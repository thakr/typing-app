import {useState, useEffect} from "react";
import { motion } from "framer-motion";
import useKeyPress from '../useKeyPress';
const randomWords = require('random-words');
import { useRouter } from 'next/router'
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import Footer from "../components/Footer";

export default function play() {
  
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
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/generate-text")
    .then((res) => {
      let phrase = res.data.response
      setPhraseArr(phrase.split(''))
    })
    
    
  }, [])
  useEffect(() => {
    if (finished == true) {
      router.push({pathname: '/leaderboard', query: {'savedWPM': Math.round(wpm * 60), 'savedAccuracy': 100 - Math.round(incorrectAmt /  phraseArr.length * 100)}})
    }
  }, [finished, wpm, incorrectAmt])
  const handleEnter = (key) => {
    if (key.key == "Enter") {
      setCountdownActive(true);
      setFinished(false);
      window.removeEventListener('keyup', handleEnter, false)
    }
  }
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
    window.addEventListener('keyup', handleEnter, false);
    window.onkeydown = function(e) {
      if(e.keyCode == 32 && e.target == document.body) {
          e.preventDefault();
          return false;
      }
  };
  }, [])
  useEffect(() => {
    if (phraseArr.length > 0 && charAt == phraseArr.length) {
      setWordsCompleted(v => v + 1);
      setActive(false);
      setFinished(true);
    }
  }, [charAt, active])
  return (
    <div className="bg-gray-100">
      <div className="container flex flex-col items-center mx-auto w-full justify-center">
        <motion.div className={`absolute flex w-[100%] h-[100%] items-center justify-center bg-blue-900 flex-col`} animate={countdownActive ? {opacity: 0.9} : {opacity: 0, display: 'none'}}>        
          <motion.h1 className={`font-bold text-6xl z-10 text-white opacity-0`} animate={countdownActive ? {opacity: 1} : {opacity: 0}}>{countdownSecs}</motion.h1>
        </motion.div>
        <div className="w-2/3 py-10 min-h-screen flex justify-center flex-col">
          
          {phraseArr.length > 0 ? (
            <motion.h1 className="font-mono text-xl code text-left" animate={phraseArr.length > 0 ? {opacity: 1} : {opacity: 0}} initial={{opacity: 0}}>
            {phraseArr.map((v,i) => {
              return <span key={i} className={`font-semibold text-2xl ${(charAt == i ? "underline bg-blue-100 rounded-sm" : "no-underline")} ${(charAt > i ? "text-blue-500" : incorrectLetter && charAt == i ? "text-red-500 line-through" :"text-gray-800")}`}>{v}</span>;
            })}
            </motion.h1>
          ) : 
          <motion.div className="flex items-center justify-center">
            <ClipLoader size={50}/>
          </motion.div>}
          <br />
          <div className="flex items-center justify-center">
            <motion.button animate={!active && !finished && phraseArr.length > 0 ? {scale: 1, opacity: 1} : {scale: 0.25, opacity: 0, display: "none"}} transition={{duration: 0.5}} className="bg-blue-900 shadow-lg text-xl py-1 px-5 rounded-3xl font-bold cursor-pointer border-blue-900 text-white border-2 hover:bg-transparent ease-in-out transition hover:text-black" onClick={() => setCountdownActive(true)}>Begin</motion.button>
          </div>
          {active && <p className="font-semibold text-gray-800">{Math.round(wpm * 60)} wpm</p>}
          {active && <p className="font-semibold text-gray-800">{100 - Math.round(incorrectAmt /  phraseArr.length * 100)}% accuracy</p>}
          </div>
        </div>
      <Footer />
    </div>   
  )
}
