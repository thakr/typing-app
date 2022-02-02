import {useEffect, useState} from 'react';
const axios = require('axios');

import { useRouter } from 'next/router'
import { motion } from "framer-motion";
import prisma from '../db';

export default function leaderboard({referer, leaderboard}) {
  const router = useRouter()
  const {savedWPM, savedAccuracy} = router.query;
  const [name, setName] = useState('');
  const [submitting,setSubmitting] = useState(false);
  const [errorTxt, setErrorTxt] = useState("");
  console.log('referer: ' + referer);
  console.log('host: ' + process.env.HOST)
  const [view, setView] = useState(referer == process.env.HOST ? "addName" : "leaderboard");
  leaderboard.sort((a,b) => {
    return b.wpm - a.wpm;
  })
  return (
      <motion.div className='flex w-[100%] h-screen items-center justify-center flex-col bg-blue-900' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity:0}}>
        {referer == process.env.HOST  && <h1 className={`font-bold text-4xl z-10 text-white mb-5`}>Nice job!</h1>}
        <div className="bg-white rounded-lg shadow-lg w-96 mb-5 h-96 overflow-auto relative">
        <h1 className="font-bold text-xl mb-2 text-white p-4 bg-gray-900 overflow-hidden">Leaderboard</h1>
        {view == "addName" ? (<div className='h-[80%] w-full bg-white absolute flex items-center flex-col'>
          <table className="mx-2 mb-10" cellPadding={'10'}>
            <tbody>
              <tr className="border-b-[1px] border-gray-500 text-left">
                <th className="w-[90%]">Name</th>
                <th>WPM</th>
                <th>Accuracy</th>
              </tr>
             <tr className="border-b-[1px] border-gray-500">
                <td className="font-semibold">You</td>
                <td className="font-semibold">{savedWPM}</td>
                <td className="font-semibold">{savedAccuracy}%</td>
              </tr>
            </tbody>
            
            </table>
            <div className='flex flex-row'>
              <form onSubmit={
                async (e) => {
                  e.preventDefault();
                  setSubmitting(true);
                  const res = await axios.post('/api/leaderboard', {
                    name,
                    wpm: parseInt(savedWPM.toString()),
                    accuracy: parseInt(savedAccuracy.toString())
                  })
                  if (res.data.status == 200) {
                    window.open('/leaderboard', '_self');
                  }
                  else {
                    setErrorTxt(res.data.msg);
                    setSubmitting(false);
                  }
                }
              }>
                <input required placeholder='Name' className='outline-none border-[1px] border-gray-500 px-3 py-1 focus:ring-2 rounded-full mr-5' onChange={(e) => {
                  e.preventDefault();
                  setName(e.target.value);
                }}></input>
                <button disabled={submitting} className="bg-blue-900 disabled:bg-gray-500 disabled:border-gray-500 shadow-lg text-md py-1 px-4 rounded-3xl font-bold cursor-pointer border-blue-900 text-white border-2 hover:bg-transparent ease-in-out transition hover:text-black">Submit</button>
              </form>
              
            </div>
            <a className='text-blue-700 hover:underline cursor-pointer mt-5' onClick={() => setView("leaderboard")}>View full leaderboard</a>
            <a className='text-red-700 mt-5' onClick={() => setView("leaderboard")}>{errorTxt}</a>
          </div>) :
        <div>
          <table className="mx-2 mb-10" cellPadding={'10'}>
            <tr className="border-b-[1px] border-gray-500 text-left">
              <th>Rank</th>
              <th className="w-[90%]">Name</th>
              <th>WPM</th>
              <th>Accuracy</th>
            </tr>
            {leaderboard.map((v,i) => {
              return (
                <tr className="border-b-[1px] border-gray-500" key={v.key}>
                  <td>{(i+1).toString()}</td>
                  <td>{v.name}</td>
                  <td>{v.wpm}</td>
                  <td>{v.accuracy}%</td>
                </tr>
              )
            })}

          </table>
          {referer == process.env.HOST && <div className='text-center'><a className='text-blue-700 hover:underline cursor-pointer text-center' onClick={() => setView("addName")}>Submit score</a></div>}
        </div>
        }
      </div>
        <motion.button className="bg-white shadow-lg text-xl py-1 px-5 rounded-3xl font-bold cursor-pointer border-white text-black border-2 hover:bg-transparent ease-in-out transition hover:text-white" onClick={() => router.push('/')}>Play<span>{referer == process.env.HOST && " again"}</span></motion.button>
      </motion.div>
  );
}
export async function getServerSideProps(context) {

  let referer = context.req.headers.referer ? context.req.headers.referer : null;
  let leaderboard = await prisma.LeaderEntry.findMany({
    select: {
      id: true,
      name: true,
      wpm: true,
      accuracy: true,
      ipv4: true,
    },
  })
  return {props: {referer, leaderboard}};
}
