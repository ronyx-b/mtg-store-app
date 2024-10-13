import userController from "@/dataService/userController";
import jwtPassportUtils from "@/utils/jwtPassportUtils";

/**
 * @async
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password, keepLogged } = req.body;
      const user = await userController.loginUser({ email, password });
      const tokenPayload = {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      };
      const optionsExpiresIn = keepLogged ? {} : { expiresIn: '24h' };
      // console.log({tokenPayload});
      const token = jwtPassportUtils.signToken(tokenPayload, optionsExpiresIn)
      res.status(201).json({
        success: true, 
        token,
      });
    }
    catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}