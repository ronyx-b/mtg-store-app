import ordersController from "@/dataService/ordersController";
import userController from "@/dataService/userController";
import jwtPassportUtils from "@/utils/jwtPassportUtils";

/**
 * @async
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    const user = jwtPassportUtils.getUser(req, res);
    const orders = await ordersController.getOrdersByUserId(user._id);
    res.status(200).json({ orders });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}