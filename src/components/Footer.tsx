import React from 'react';

export default function Footer() {
  return <footer className="bg-black w-screen max-w-[100%]">
  <div className="py-16 px-16 md:px-52 flex flex-col md:flex-row justify-between">
    <div>
    <img src="/QuickTypeWhite.svg"></img>
      <div className="mt-5">
      <p className="text-gray-300 md:w-96">QuickType is an application created by Shaan Thakker and uses OpenAI's GPT-3 model for text generation.</p>
        
      </div>
    </div>
      <div className="flex flex-col mt-10">
        <a href="/" className="text-white font-semibold mb-2 hover:underline">Home</a>
        <a href="/play" className="text-white font-semibold mb-2 hover:underline">Play</a>
        <a href="/leaderboard" className="text-white font-semibold hover:underline">Leaderboard</a>
      </div>
      
  </div>
  <p className="text-gray-300 font-semibold pb-8 px-16 md:px-52">Copyright © Shaan Thakker</p>
</footer>;
}
