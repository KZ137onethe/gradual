import { defineMock } from "vite-plugin-mock-dev-server"
import { fakerZH_CN as faker } from "@faker-js/faker"

import { apiPath, generateInteger } from "./config"

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
])

