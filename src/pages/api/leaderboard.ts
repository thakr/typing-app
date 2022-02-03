// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../db";
export default async (req, res) => {
  const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
  const override = req.query.override;
 
  if (req.method = 'POST') {
    if (req.body.name && req.body.wpm && req.body.accuracy) {
      const sameIpUser = await prisma.LeaderEntry.findFirst({
        where: {
          ipv4: ip,
        },
      })
      if (override) {
        await prisma.LeaderEntry.update({
          where: {
            ipv4 : ip,
          },
          data: {
            name: req.body.name,
            wpm: req.body.wpm,
            accuracy: req.body.accuracy,
          }
        })
      } else {
        if (sameIpUser) {
          return res.json({status: 300, msg:'Looks like you already have an entry on your device. Overwrite it?'})
        } else {
          await prisma.LeaderEntry.create({
            data: {
              name: req.body.name,
              wpm: req.body.wpm,
              accuracy: req.body.accuracy,
              ipv4: ip
            }
          })
        }
      }
      
      return res.json({status: 200, msg:'success'})
    } else {

        return res.json({status: 400, msg:'Missing information'})

    }
  }
  
  


}
