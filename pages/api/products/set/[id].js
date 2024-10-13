import productController from "@/dataService/productController";

/**
 * @async
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    const set = req.query?.id;
    const pageSize = req.query?.pageSize || 10;
    const pageNum = req.query?.pageNum || 1;
    const results = await productController.getAllProductsBySet(set, { pageSize, pageNum });
    res.status(200).json(results);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}