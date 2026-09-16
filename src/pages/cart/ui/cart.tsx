import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { fetchProductById } from "@/entities/product";
import { useCartStore } from "@/features/cart/add-to-cart";
import { formatPrice } from "@/shared/lib/format";
import { Button } from "@/shared/ui/Button";
import { OptimizedImage } from "@/shared/ui/OptimizedImage";
import { SectionSkeleton } from "@/shared/ui/Skeleton";

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const productIds = items.map((item) => item.productId);

  const { data: products, isLoading } = useQuery({
    queryKey: ["cart-products", productIds],
    queryFn: () => Promise.all(productIds.map((id) => fetchProductById(id))),
    enabled: productIds.length > 0,
  });

  const cartRows = items
    .map((item) => {
      const product = products?.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const totalPrice = cartRows.reduce(
    (sum, row) => sum + row.product.price * row.quantity,
    0,
  );

  return (
    <div className="coupang-shell min-h-screen flex flex-col bg-[#f4f7fb]">
      <main
        id="main-content"
        className="flex-1 max-w-4xl mx-auto w-full px-4 py-6"
      >
        <h1 className="mb-5 text-2xl font-black text-[#111827]">장바구니</h1>

        {items.length === 0 && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b] shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <ShoppingCart
              className="mx-auto mb-3 text-[#c9d3e1]"
              size={40}
              aria-hidden="true"
            />
            <p className="text-lg font-medium">장바구니가 비어 있습니다.</p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm font-semibold text-[#346aff] hover:underline"
            >
              쇼핑하러 가기
            </Link>
          </div>
        )}

        {items.length > 0 && isLoading && (
          <div className="flex flex-col gap-4">
            <SectionSkeleton lines={3} />
            <SectionSkeleton lines={3} />
          </div>
        )}

        {items.length > 0 && !isLoading && (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
            <div className="flex flex-col divide-y divide-[#edf2f7] rounded-[24px] border border-[#e4ebf3] bg-white px-5">
              {cartRows.map((row) => (
                <div
                  key={row.productId}
                  className="flex items-center gap-4 py-5"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#f7f9fc]">
                    <OptimizedImage
                      src={row.product.imageUrls[0]}
                      alt={row.product.name}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#111827]">
                      {row.product.name}
                    </p>
                    <p className="mt-1 text-base font-black text-[#111827]">
                      {formatPrice(row.product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(row.productId, row.quantity - 1)
                      }
                      aria-label="수량 감소"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e4ebf3] text-[#516074] hover:bg-[#f4f7fb]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {row.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(row.productId, row.quantity + 1)
                      }
                      aria-label="수량 증가"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e4ebf3] text-[#516074] hover:bg-[#f4f7fb]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(row.productId)}
                    aria-label={`${row.product.name} 삭제`}
                    className="ml-2 text-[#9aa7b8] hover:text-[#e11937]"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[28px] border border-[#dfe7f2] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <h2 className="text-lg font-black text-[#111827]">결제 금액</h2>
                <div className="mt-4 flex justify-between text-sm text-[#516074]">
                  <span>총 상품 금액</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-[#516074]">
                  <span>배송비</span>
                  <span className="font-semibold text-[#346aff]">무료</span>
                </div>
                <div className="mt-4 flex justify-between border-t border-[#edf2f7] pt-4 text-base font-black text-[#111827]">
                  <span>총 결제 금액</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <Link to="/checkout" className="mt-5 block">
                  <Button type="button" fullWidth>
                    주문하기
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
