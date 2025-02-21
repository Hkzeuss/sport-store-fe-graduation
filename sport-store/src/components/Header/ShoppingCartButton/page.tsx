import { ShoppingCart } from "lucide-react";

const ShoppingCartButton = () => (
  <div className="relative flex items-center gap-3 text-lg font-semibold text-black">
    <ShoppingCart className="w-6 h-6" />
    <div>Giỏ hàng</div>
    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2">1</span>
  </div>
);

export default ShoppingCartButton;