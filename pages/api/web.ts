import { A, S, flow, pipe } from "@mobily/ts-belt";
import axios from "axios";
import { load } from "cheerio";
import { Presets, SingleBar } from "cli-progress";
import { writeFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import pMap from "p-map";
import { join } from "path";

export const apiKay = "B3BAB31C-ED9B-4E40-8C2A-8C6627C1C685"

const ax = axios.create({
    headers: {
        "cookie": "bbtracker=id=9c476300-3f3a-406d-b9d6-1b161b0fd7fa; bbsession=id=1aedfb20-a2e5-42c7-88c4-24afbae2cb23; GdprConsent-Custom=eyJ2ZW5kb3JJZHMiOnsiNjIyNjE5YjNkMTIzZTkwNmE5MWJhMDY4Ijp0cnVlLCI1ZTcxNmZjMDlhMGI1MDQwZDU3NTA4MGYiOnRydWV9fQ==; _sp_su=false; _gcl_au=1.1.1860179801.1709061212; axd=4353641678427711055; _pulse2data=8eadcbd7-f382-468c-b23f-ba32beaa1735%2Cv%2C%2C1710270813000%2CeyJpc3N1ZWRBdCI6IjIwMjQtMDItMjdUMTk6MTM6MzNaIiwiZW5jIjoiQTEyOENCQy1IUzI1NiIsInJlSXNzdWVkQXQiOiIyMDI0LTAyLTI3VDE5OjEzOjMzWiIsImFsZyI6ImRpciIsImtpZCI6IjIifQ..VuwfSV4uILlV8CD-G7_qzg.OPEjnHlqkOxgRwvg0hYjakuU6hUjuqq6aI6d2-mZZoPJ3oInb_3l0iyc3R6iCj6tqxRNgz3EHruHy8Pmt3SjMDLearStikP4bsNwvdrvH7ftYHjg4kUdiZ7Jko1FZG4xlcf0AYuvwifJfv3AMsqR8REY_TXUb9u9qp3h-LmL1-cc-PbGRQ6v41iIzMvWbRFfNi3eYfAdEvR4JfpztN9MqLRY8F2mRdy-c-CgcTZ4Aw9G-5dHutxQj3nBtJyA0Qu-OEm8vbIAT4awMkROwGxH_jFoMiHVHgR6wQF9IfsQD0znULfn0AtJ47Eomzy0ja0JPD-vfXaOwjf-C1JkhNL-hQ.uOgMU_lcz4U5MrHgkCnEXQ%2C%2C0%2Ctrue%2C%2CeyJraWQiOiIyIiwiYWxnIjoiSFMyNTYifQ..ry4BoQzuU0cfj8WXTnvPfWlpKZeQJTWKsPBs33VgDHc; _sharedid=adad4cc5-18e3-4061-8df3-57d30540dbf5; _hjSessionUser_2664500=eyJpZCI6ImRjYWRmYzMyLWFlZDAtNTJlOC1iOGIyLWRiZGM1MzA5ZDQ1ZSIsImNyZWF0ZWQiOjE3MDkwNjEyMTIyODUsImV4aXN0aW5nIjp0cnVlfQ==; __gads=ID=bfdc006256fad051:T=1709061214:RT=1709242609:S=ALNI_MZtauNS6qGhFkeL8neJ-dYCGO8jQQ; __gpi=UID=00000d63504dc403:T=1709061214:RT=1709242609:S=ALNI_Mb4f9PNBjeMjT94VrXpwUJq-TcOBA; __eoi=ID=b5b8f72957a7cefc:T=1709061214:RT=1709242609:S=AA-AfjbrhWWwInMuTu7_WyelJdIZ; _hjSessionUser_3633896=eyJpZCI6ImE1YWUxNTFmLWE0NzQtNTg1MS1hYTJmLWM1ZTA4NzYyMTU4MyIsImNyZWF0ZWQiOjE3MDkyNDQ1MTAyMTQsImV4aXN0aW5nIjpmYWxzZX0=; consentUUID=bd94b368-e9ef-45f3-b55c-68fd2497a399_29; consentDate=2024-02-29T22:08:36.069Z; GdprConsent={\"version\":\"IAB TCF 2.0\",\"consentString\":\"CP6vdoAP6vdoAAGABCENAoEgAP_gAEPAABpwIlNV7D_1LW1BoXp3SZMwUYxX4djirkQxBBZJk8QFwLPCMBQXkiEwNA3gNiICGBAEOFJBIQFkHICQDQCgKggRrjDEakWcgCJCJ4AEgAMQUwdICFJJGAFCOQIYxvg4cjDQ2D6twMvsBMxwj4BGmWc5BgOwWBAVA58pDPn0bBKakxAPdb40OgnwZF6DEwQFgFgAKABAADIAGgATACIgE0AVyAwQBywEBQEwkBgABAACwAKgAcAA9AC8AMAAiABmAD8AIQARwAwIBlAGWAO4AfsBIgElAKiAYoBR4C8wGrgP-AhaBDkKACAAUBAUIAMAAeAEcAmgBOwDqgK5AWIAtwBf4DIQGpgP3FAAQDqjAAIB1R0BoABYAFQAOQAvADAAIgAYgAzAB-AGAAMoAaIA_QCLQEdASUAqIBigD7AJkAUeAt0BeYDLAGrgPuAhaBDkeACAAUBAUcAUAAQAA8AC4ARwAoACOAHIAO4AhABOwDqgIQAVyAsQBbgC_wGQgNTAcsA_cpAaAAWABUADgAMAAiABSADEAGYAPwAwABlADRAH6ARYAjoBJQCogGKAPaAfYBeYDLAHigP-AhaBDkqABAgKUAGAAXACOAI4AcgA7gCRAF1AOqAqQBbgDUwH7koBgACAAFgAcABgAEQAMQAjgBgAFRAMUAo8BeZMACBAUkAJAAuAEcAdwB1QFuAL_AZYA5YB-5CAQAAsAMQAjgBgADuAKiAYoCFpEACBAUgAHAAQAA8AcgB1QFiANTAcsWgCACOAGAAO4A-xYAIAMsBXIDUwHLAA.YAAAAAAAAAAA\"}; _pbjs_userid_consent_data=1939472661208995; tis=EP114%3A3830; aws-waf-token=0fd54812-667c-404e-8c28-eec46621795f:CgoAgv+Q3VX9AAAA:8ATYCp5fLFm3c7UzyyaHzxOZ5anwKtkhGfqJEfHCbEzXdBVYs658n2ekbACUPLQazYEfm8ckoKfJ99ThcKnkNmdyLSOYg2ihc5CZJzpszm1p24OKVamSIpxgL0+HFUfGP0u9VNOo04Pp+3ykvETYA6tAfw0HQcRvcz+Kn6oNVO6qAtdLqZLfV2dO5rJRRhEspKZC/iwpTkc02+Jws/BDnUZCDsqv/c7yt11YbOygRQeD3GUjb0DmnKUgjrEl; _hjSession_2664500=eyJpZCI6ImQ2ZTYyMGJkLTQzMTktNGUzMi05MTEwLTJkYjQwNDhhNjU5YyIsImMiOjE3MDk1ODUxNzU3OTksInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowfQ==; _pulsesession=%5B%22sdrn%3Aschibsted%3Asession%3Ab58fdbc5-aea6-417f-ba78-58e5d6e68d16%22%2C1709585176066%2C1709585176066%5D; cto_bidid=EDJKM19uM1pxQVBOYUJVa1VRc1VGMXh6czFxZHNJVXh5SVFoZ2E2NG1iTVdUSmxNSUM3NkYzM2ZmQ2c5eGdkS1lhd3I3M2IlMkZ6ZWhKT1J6Q0gxTURMTGpCeHIwWjc2TWp1WWVoMkpFalUzWXBqcnVJJTNE; cto_bundle=AVvGBV9McEZwT2NEbDVtTklzV0Q0c3RaVnJSMDh2MXBVVmNHWHFtNUl6NVdLRzlrQThJV0JOd1I2aDZMdUdUNDJSMHR3SXo3RkRWblpBQ3RvMG1YMzVzSVM0MzY2RCUyQlI3RWt3ajhHVzI0RDlMb0kzVnFqcXZzZHJCQU5LV3JTOEdCbkdSZUhMSGtNakhjZ2t5dE16elRsRGN6OHBXalNMeDhMakF2aWRkSXlldDJ2ell4ejM3UFpCT0UlMkIlMkZXZXJCTHhQYnpDNXlnZW0yd0hUVHVhdVZiSHpyVzc2Zkg5RTJXSUhJQXhyWEZOVUFyS0REJTJGQjQlMkZsUVZaMFV5VDN4TVo0VGdhak9GT3NXbVpycnhPMDBpJTJGMWN3NWUlMkZlMmFmeUltTUNLUlJLZ1gwYmdDSyUyRjBxRzBFT3ZEbFZnTWY4Y2hLWTZMZ3U",
    },

})

function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export type catListing = {
    id: string,
    model: string,
    priceText: string,
    price: number,
    year: string,
    kmText: string,
    km: number,
    fuel: string,
    priceKM: number
    link: string
}

let config = {
    fuel: 3,
    pricefrom: 10000,
    pricetype: "Retail",
    rangefrom: 430,
    sortby: "price",
    sortorder: "asc",
}




export default async function handler(req: NextApiRequest, res: NextApiResponse,) {
    const rootPage = `https://www.bilbasen.dk/brugt/bil?fuel=3&pricefrom=10000&pricetype=Retail&rangefrom=350&sortby=price&sortorder=asc`

    // const p1 = await ax.get("https://www.bilbasen.dk/brugt/bil?fuel=3&pricefrom=10000&pricetype=Retail&rangefrom=430&sortby=price&sortorder=asc")
    const p1 = await ax.get(rootPage)
    await delay(4000)

    const p1Page = load(p1.data)
    const p1Pagination = p1Page(".Pagination_pagination__GywrN span").last().text().replace(/\D/g, "")
    const pc = Number(p1Pagination)

    const bar1 = new SingleBar({
        stopOnComplete: true,
        hideCursor: true,
        format: 'progress [{bar}] {percentage}% | {value}/{total} | ETA: {eta_formatted} | time: {duration_formatted}'
    }, Presets.shades_classic);
    bar1.start(pc, 0);

    const rawData = await pMap(A.range(1, pc), async (page) => {
        // const p = await ax.get(`https://www.bilbasen.dk/brugt/bil?fuel=3&pricefrom=10000&pricetype=Retail&rangefrom=430&sortby=price&sortorder=asc&page=${page}`)
        const p = await ax.get(`${rootPage}&page=${page}`)
        await delay(4000)

        bar1.increment();
        return p.data
    }, { concurrency: 3 })

    bar1.stop();

    let allPages = ""

    for (const page of rawData) {
        try {
            allPages = S.concat(allPages, page)
        }
        catch (e) {
            console.log(e);
        }
    }

    const $ = load(allPages)
    const articles = $('.Listing_listing__XwaYe').toArray()

    let data: catListing[] = []

    for (const article of articles) {
        const model = $(article).find('.Listing_makeModel__7yqgs h3').text()
        const priceText = $(article).find('.Listing_price__6B3kE h3').text()
        const price = Number(priceText.replace(/\D/g, ""))
        const link = $(article).find(".Listing_link__6Z504").attr("href") as string

        const rawDetails = $(article).find('.Listing_details__bkAK3 ul li').toArray()

        // find the year by looking of a pattern mm/yyyy or m/yyyy
        // find the distance driven by looking for a pattern of 1-3 digits then a . then 3 digits then a space then km

        let details: {
            year: string,
            kmText: string,
            km: number
            fuel: string
        } = {
            year: "",
            kmText: "",
            km: 0,
            fuel: ""
        }

        for (let i = 0; i < rawDetails.length; i++) {
            const detail = rawDetails[i]
            const detailText = $(detail).text()

            if (detailText.match(/\d{1,2}\/\d{4}/)) {
                details.year = detailText
            }

            if (detailText.match(/\d{1,3}\.\d{3} km/)) {
                details.kmText = detailText
                details.km = Number(detailText.replace(/\D/g, ""))
            }

            const fuelTypes = ["Benzin", "Diesel", "El", "Hybrid", "Plug-in"]
            if (fuelTypes.includes(detailText)) {
                details.fuel = detailText.toLowerCase()
            }

        }

        const priceKM = Number((price / details.km).toFixed(2))

        const id = pipe(
            link,
            S.split("/"),
            A.reverse,
            A.take(4),
            A.reverse,
            A.join("-")
        )

        data.push({
            id,
            model,
            priceText,
            price,
            ...details,
            priceKM,
            link: link
        })
    }

    console.log(data.length);

    let outData = pipe(
        data,
        basicFliter,

        A.uniqBy(car => car.id),

        A.sort((a, b) => b.priceKM - a.priceKM),
    )

    // data file path
    const filePath = join(process.cwd(), 'data.json')
    writeFileSync(filePath, JSON.stringify(outData, null, 2))

    res.json(outData);
}


export const basicFliter = flow(
    A.filter((car: catListing) => car.km != 0),
    A.filter(car => car.kmText != ""),
    A.filter(car => car.priceKM != null),
    A.filter(car => car.fuel != ""),
)
