// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../db";
export default async (req, res) => {
  const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
  if (req.method = 'POST') {
    if (req.body.name && req.body.wpm && req.body.accuracy) {
      await prisma.LeaderEntry.create({
        data: {
          name: req.body.name,
          wpm: req.body.wpm,
          accuracy: req.body.accuracy,
          ipv4: ip
        }
      })
      res.json({status: 200, msg:'success'})
    } else {
      console.log('bad req')
      res.json({status: 400, msg:'missing information'})

    }
  }
  
  


}
