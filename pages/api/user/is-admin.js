import jwtPassportUtils from "@/utils/jwtPassportUtils";

/**
 * @async
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    let isAdmin = jwtPassportUtils.isAdmin(req, res);
    res.status(200).json({isAdmin});
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}