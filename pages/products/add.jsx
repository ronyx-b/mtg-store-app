import ManageProduct from "@/components/ManageProduct";

export default function AddProduct({ ...props }) {
  return (<ManageProduct action="add" {...props} />);
}