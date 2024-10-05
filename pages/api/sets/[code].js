import setController from "@/dataService/setController";

/**
 * @async
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    const code = req.query?.code;
    console.log(code);
    const set = await setController.getSetByCode(code);
    res.status(200).json({ set });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}