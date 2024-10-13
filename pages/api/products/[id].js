import productController from "@/dataService/productController";

/**
 * @async
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    const id = req.query?.id;
    const productDetails = await productController.getProductDetailsById(id);
    res.status(200).json({ productDetails });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}