import { A, pipe } from "@mobily/ts-belt";
import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import { basicFliter, catListing } from "./web";

export default async function handler(req: NextApiRequest, res: NextApiResponse,) {
    // load data.json form .
    const filePath = join(process.cwd(), 'data.json')
    const file = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(file) as catListing[]

    let outData = pipe(
        data,
        basicFliter,

        A.filter(car => car.priceKM > 1),
        A.filter(car => car.km > 10000),
        A.filter(car => car.price < 165000),
        A.filter(car => car.range > 400),

        A.filter(car => car.model != "Renault Zoe"),
        // A.filter(car => car.model != "Nissan Leaf"),


        A.sort((a, b) => b.priceKM - a.priceKM),
    )

    return res.status(200).json(outData)

}