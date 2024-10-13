import jwtPassportUtils from "@/utils/jwtPassportUtils";

/**
 * @async
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */
export default async function handler(req, res) {
  let isAdmin = jwtPassportUtils.isAdmin(req, res);
  res.status(200).json({isAdmin});
}