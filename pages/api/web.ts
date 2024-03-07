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
        "cookie": "aws-waf-token=1d9c4815-cc32-4bd5-af53-f5523c4e3a95:CgoAbvR0ISEQAAAA:s3oiA0z02QQ8agCeI7G0nGUPV5XhM0vNKJVO4n7NWrspZt9txPEvyFsPLbHz34hlbx5Av+aY21j5Ka6Fw9WC4tRxs3t1J7VPOsOYbb2OcZQjgUBMzNOQMTEY2HTZJI51zgXYHWezEPY9Vgs2FWJBkMJST8NmSiZWDyYHZihOXCG+Yk3xMYEIutQwWfQQxcYG+MGyWJ9xYT8638tsK81pTzsyytc8lqZEh+mHFHVmJMcD3KRDhpKCeSdauvrFxkIv; _sp_su=false; _pulse2data=8d93f3e8-0f35-442c-813e-1bba6895a520%2Cv%2C%2C1710865954000%2CeyJpc3N1ZWRBdCI6IjIwMjQtMDMtMDVUMTY6MzI6MzRaIiwiZW5jIjoiQTEyOENCQy1IUzI1NiIsInJlSXNzdWVkQXQiOiIyMDI0LTAzLTA1VDE2OjMyOjM0WiIsImFsZyI6ImRpciIsImtpZCI6IjIifQ..k2bgGhYU98_ChdMuFkcp0A.DneovSLwl3kt9fO4pwJ38SvR14VqaM-wmKFux5G7gT_8wagVHqpDXwd-8XsqC-2TLigdfmtEB8vGEuC2-_V7OAMndiogYxfXDgtMCJe45iWr_8foEv30N9ITZnDFwOGvN4FIfnoBuZFh9bmqw_rQGm1PmxCNJw8VL4LruRQGQkZYUBG2wtxDLc-7ahZnN6B7lNiBxh3JfdFGvTnw-yOxQS6PNIbC2sFsVy4-seHaKiGoKQPu9toAeZn-62vDp9QfafQnnvEVR6lp-JvgWdxq1cYOeod0SeX_GX4XanNDU6t8MGXnm83pSh6UoNQpgLakLQjcJgRmcE_uUZYEXLDZfQ.u7mZTYMP6tfeXVev4DjWfQ%2C%2C0%2Ctrue%2C%2CeyJraWQiOiIyIiwiYWxnIjoiSFMyNTYifQ..dB68dpr23UINFRUmdFdJ6-Y7TEK0OJR6d5cu2wsOULI; consentUUID=112ad6d5-7311-4c40-a943-b537ec622642_29; consentDate=2024-03-05T16:33:19.585Z; GdprConsent={\"version\":\"IAB TCF 2.0\",\"consentString\":\"CP6_8UAP6_8UAAGABCENAqEgAP_gAEPAAAZQIlNV7D_1LW1BoXp3SZMwUYxX4djirkQxBBZJk8QFwLPCMBQXkiEwNA3gNiICGBAEOFJBIQFkHICQDQCgKggRrjDEakWcgCJCJ4AEgAMQUwdICFJJGAFCOQIYxvg4cjBQ2D6twMvsBMxwj4BGmWc5BgOwWBAVA58pDPn0bBKakxAPdb40OgnwZF6DEwQFgFgAKABAADIAGgATACIgE0AVyAwQBywEBQEwkBgABAACwAKgAcAA9AC8AMAAiABmAD8AIQARwAwIBlAGWAO4AfsBIgElAKiAYoBR4C8wGrgP-AhaBDkKACAAUBAUIAMAAeAEcAmgBOwDqgK5AWIAtwBf4DIQGpgP3FAAQDqjAAIB1R0BoABYAFQAOQAvADAAIgAYgAzAB-AGAAMoAaIA_QCLQEdASUAqIBigD7AJkAUeAt0BeYDLAGrgPuAhaBDkeACAAUBAUcAUAAQAA8AC4ARwAoACOAHIAO4AhABOwDqgIQAVyAsQBbgC_wGQgNTAcsA_cpAaAAWABUADgAMAAiABSADEAGYAPwAwABlADRAH6ARYAjoBJQCogGKAPaAfYBeYDLAHigP-AhaBDkqABAgKUAGAAXACOAI4AcgA7gCRAF1AOqAqQBbgDUwH7koBgACAAFgAcABgAEQAMQAjgBgAFRAMUAo8BeZMACBAUkAJAAuAEcAdwB1QFuAL_AZYA5YB-5CAQAAsAMQAjgBgADuAKiAYoCFpEACBAUgAHAAQAA8AcgB1QFiANTAcsWgCACOAGAAO4A-xYAIAMsBXIDUwHLAA.YAAAAAAAAAAA\"}; GdprConsent-Custom=eyJ2ZW5kb3JJZHMiOnsiNjIyNjE5YjNkMTIzZTkwNmE5MWJhMDY4Ijp0cnVlLCI1ZTcxNmZjMDlhMGI1MDQwZDU3NTA4MGYiOnRydWV9fQ==; _gcl_au=1.1.665977541.1709668255; axd=4355491280455457510; tis=; _pbjs_userid_consent_data=5259054670109642; _sharedid=b8633320-acc5-417a-a520-1b63209dd378; _hjSessionUser_2664500=eyJpZCI6IjgyNzA2NWNlLWI4ZjEtNWU2Ni1hZjE4LTdiYjA2YTQ5NzhkYyIsImNyZWF0ZWQiOjE3MDk2NjgyNTU1NTAsImV4aXN0aW5nIjp0cnVlfQ==; _pulsesession=%5B%22sdrn%3Aschibsted%3Asession%3A12ced740-b61d-49af-adcf-479be43e4381%22%2C1709783322263%2C1709783322263%5D; _hjSession_2664500=eyJpZCI6ImM4ZjYzNDFmLTNlZGMtNDljMS05MTExLWI1MmNmZGFmZjA0YiIsImMiOjE3MDk3ODMzMjIzMjQsInMiOjEsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowfQ==; cto_bidid=_XhXWF9jRzAlMkZyU0slMkJPYU5YWCUyRmlsSHNhSXdMWkZUM2hhYVB5V1ZEdHFsdXZCRHlZY0dnWVBtNDRSMFNlcDJxM0h5Z3dhbTNDdFhPS2hXR1hkOWd2TGttejBnZCUyRmdrY2dhOCUyQkxuRFN1cFplaTZYd2slM0Q; cto_bundle=bXUqcV9hcUgyJTJGekVKYkhoZTVsT2Z3Z2R4UHR4YiUyQm1ydkxqVktRMEdYVVJOc1FtV0l2ZWxIRXFiNWdqJTJCdlNJdVZhRmhxd0tjbnZ0b243S1BtUG03N3lZTm1yMVl3dlNBVzVXZlROdmxvRjV5eXpySWpPaWxkU2x3b0QlMkJvQ1U4a3A2eDFRVmcyVDhIVCUyQlU0cjFpR3dPdjklMkI2NUElM0QlM0Q"
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
    rangeText: string,
    range: number,
    priceKM: number
    link: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse,) {
    const rootPage = `https://www.bilbasen.dk/brugt/bil?pricefrom=10000&pricetype=Retail&sortby=price&sortorder=asc`

    // const p1 = await ax.get("https://www.bilbasen.dk/brugt/bil?fuel=3&pricefrom=10000&pricetype=Retail&rangefrom=430&sortby=price&sortorder=asc")
    const p1 = await ax.get(rootPage)
    await delay(4000)

    const p1Page = load(p1.data)
    const p1Pagination = p1Page(".Pagination_pagination__GywrN span").last().text().replace(/\D/g, "")
    const pc = Number(p1Pagination)
    console.log("web pages "), pc;


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
    }, { concurrency: 1 })

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
            rangeText: string
            range: number
        } = {
            year: "",
            kmText: "",
            km: 0,
            fuel: "",
            rangeText: "",
            range: 0
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

            if (detailText.includes("km rækkevidde")) {
                details.rangeText = detailText
                details.range = Number(detailText.replace(/\D/g, ""))
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
