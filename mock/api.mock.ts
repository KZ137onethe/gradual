import path from "node:path"
import fs from "node:fs"
import { defineMock } from "vite-plugin-mock-dev-server"
import { fakerZH_CN as faker } from "@faker-js/faker"

import { apiPath, generateInteger } from "./config"
import { error } from "node:console"

export default defineMock([
  {
    url: apiPath('test'),
    method: ["POST"],
    type: "json",
    body({ body }) {
      const { current, limit } = body as any
      const randomVal = generateInteger(100)
      const result: any[] = []
      for(let i = randomVal; i > 0; i--) {
        result.push({
          date: faker.date.between({ from: '1950-01-01', to: '2020-12-30' }).toLocaleString('cn'),
          name: faker.person.fullName(),
          address: `${faker.location.country()} ${faker.location.county()}`
        })
      }
      return JSON.stringify({
        data: {
          records: result.slice((current - 1) * limit, current * limit),
          current,
          limit,
          total: randomVal
        }
      })
    },
    status: 200
  },
  {
    url: apiPath('7z/novel'),
    method: ["POST"],
    response(req, res) {
      const { body: { filename = "" } } = req
      const filePath = path.resolve(__dirname, `./save/7z/novel_${filename}.7z`)

      res.setHeader("Content-Type", "application/x-7z-compressed")
      res.setHeader("Content-Disposition", `attachment; filename=novel_${filename}.7z`)

      const readStream = fs.createReadStream(filePath)

      readStream.on('error', () => {
        console.log('文件流读取错误：', error)
        res.statusCode = 404
      })
      readStream.on('end', () => {
        res.statusCode = 200
      })

      readStream.pipe(res)
    }
  }
])

