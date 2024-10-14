import productController from "@/dataService/productController";

/**
 * @async
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */
export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const id = req.query?.id;
      const productDetails = await productController.getProductDetailsById(id);
      res.status(200).json({ productDetails });
      break;
    case "PUT":
      const formData = req.body
      res.status(200).json({formData});
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}