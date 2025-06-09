import { defineMock } from "vite-plugin-mock-dev-server"
import { fakerZH_CN as faker } from "@faker-js/faker"
import fs from "node:fs"
import path from "node:path"

import { apiPath, generateInteger } from "./config"

// 示例：https://vite-plugin-mock-dev-server.netlify.app/zh/examples/response
export default defineMock([
  {
    url: apiPath('test'),
    method: ["POST"],
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
    url: apiPath('ofd-file'),
    method: ["POST"],
    response(req, res) {
      const { body: { name = "" } } = req
      const filePath = path.resolve(__dirname,`./data/${name}.ofd`)

      res.setHeader('Content-Type', 'application/ofd')
      res.setHeader('Content-Disposition', `inline; filename=${name}.ofd`)

      const readStream = fs.createReadStream(filePath)

      readStream.on('error', (err) => {
        console.error('文件流错误', err)
        res.statusCode = 404
        res.end('ofd 文件未找到')
      })

      readStream.pipe(res).on("finish", () => {
        res.statusCode = 200
      })
    }
  }
])

