import setController from "@/dataService/setController";

/**
 * @async
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    const pageSize = req.query?.pageSize || 10;
    const pageNum = req.query?.pageNum || 1;
    const featuredSetList = await setController.getAllFeaturedSets({ pageSize, pageNum });
    res.status(200).json({ featuredSetList });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}