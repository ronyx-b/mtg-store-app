import userController from "@/dataService/userController";

/**
 * @async
 * @param {import("next").NextApiRequest} req 
 * @param {import("next").NextApiResponse} res 
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      let formData = req.body;
      await userController.registerUser(formData);
      res.status(201).json({success: true, message: 'new user registered'});
    }
    catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}