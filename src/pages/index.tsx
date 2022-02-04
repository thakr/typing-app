import { motion } from "framer-motion";
import { useRouter } from 'next/router'
import Footer from "../components/Footer";


export default function Home() {
  
  const router = useRouter();

  return (
    <div className="bg-gray-100">
      <div className="p-16">
        <img src="/QuickType.svg" className="w-72"></img>
        <p className="text-gray-700 mt-10 text-lg md:w-2/3 lg:w-1/3">Increase your typing speed and compete for the top spot on the leaderboard in a fun and friendly environment. QuickType uses Artificial Intelligence to generate engaging passages in order to type naturally and fluidly. QuickType also has a words per minute count and accuracy tracker.</p>
        <div className="mt-10 bg-blue-200 p-5 w-64 md:w-96 rounded-md shadow-md">
          <h2 className="font-bold text-2xl">Standard</h2>
          <button className="mt-3 bg-blue-900 shadow-lg text-xl py-1 px-5 rounded-3xl font-bold cursor-pointer border-blue-900 text-white border-2 hover:bg-transparent ease-in-out transition hover:text-black outline-none" onClick={() => router.push('/play')}>Play</button>
        </div>
        <div className="mt-10 bg-green-200 p-5 w-64 md:w-96 rounded-md shadow-md">
          <h2 className="font-bold text-2xl">Timed</h2>
          <button className="mt-3 bg-gray-400 shadow-lg text-xl py-1 px-5 rounded-3xl font-bold border-gray-400 text-white border-2 ease-in-out transition">Coming soon</button>
        </div>
        <div className="mt-10 bg-red-200 p-5 w-64 md:w-96 rounded-md shadow-md">
          <h2 className="font-bold text-2xl">Random</h2>
          <button className="mt-3 bg-gray-400 shadow-lg text-xl py-1 px-5 rounded-3xl font-bold border-gray-400 text-white border-2 ease-in-out transition">Coming soon</button>
        </div>
      </div>
      <Footer />
    </div>   
  )
}
