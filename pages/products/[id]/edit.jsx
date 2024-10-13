import ManageProduct from "@/components/ManageProduct";
import { useRouter } from "next/router";

export default function EditProduct({ ...props }) {
  const router = useRouter();
  const { id } = router.query;

  return (<ManageProduct action="edit" id={id} {...props} />);
}