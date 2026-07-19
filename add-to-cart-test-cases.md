| ID | Type | Scenario | Action | Expected Result |
|----|------|----------|--------|-----------------|
| TC-01 | Positive | Initial add-to-cart state | After login, inspect every product card | Each product shows an enabled **"Thêm vào giỏ"** button; no cart badge is shown |
| TC-02 | Positive | Add one product (badge appears) | Click "Thêm vào giỏ" on **Áo thun Basic** | Badge appears showing **1**; button label changes to **"Trong giỏ (1)"** |
| TC-03 | Positive | Added product shown in cart | Add **Áo thun Basic**, then open the cart | Drawer lists "👕 Áo thun Basic × 1", subtotal **199.000₫**, Tổng **199.000₫** |
| TC-04 | Positive | Add same product twice (increment) | Click "Thêm vào giỏ" on **Quần Jeans** twice | Single line at **× 2**; button reads **"Trong giỏ (2)"**; badge **2**; subtotal/total **998.000₫** |
| TC-05 | Positive | Add same product several times | Click "Thêm vào giỏ" on **Mũ lưỡi trai** 3 times | One line at **× 3**; badge **3**; total **447.000₫** (3×149.000) |
| TC-06 | Positive | Add multiple different products | Add **Quần Jeans**, **Giày Sneaker**, **Mũ lưỡi trai** once each | 3 separate lines each × 1; badge **3**; Tổng **1.547.000₫** |
| TC-07 | Positive | Add the entire catalog | Add all 6 products once | 6 line items each × 1; badge **6**; Tổng **2.716.000₫** |
| TC-08 | Positive | Cart badge updates on each add | Add any product 3 times, observing the badge after each click | Badge increments **1 → 2 → 3** immediately after each click |
| TC-09 | Positive | Total recalculates with mixed quantities | Add **Áo thun Basic** ×2 and **Giày Sneaker** ×1 | Two lines (×2, ×1); badge **3**; Tổng **1.297.000₫** (2×199.000 + 899.000) |
| TC-10 | Positive | Line subtotal = price × quantity | Add **Giày Sneaker** ×2, open cart | Line shows "× 2" with subtotal **1.798.000₫** |
| TC-11 | Positive | Currency/number formatting | Add products producing a large total and view Tổng | Amount is formatted vi-VN with "." thousand separators and "₫" (e.g. **1.297.000₫**) |
| TC-12 | Positive | Open cart drawer | Add a product, click the **🛒 Giỏ hàng** button | Drawer slides open showing the current cart contents |
| TC-13 | Positive | Close cart via × keeps contents | With items in cart, open drawer and click **×** | Drawer closes; reopening shows the same items and quantities unchanged |
| TC-14 | Positive | Close cart via backdrop keeps contents | With items in cart, open drawer and click the dimmed backdrop | Drawer closes; cart contents are retained |
| TC-15 | Negative | Add-to-cart requires authentication | Open the app URL without logging in and attempt to add a product | Only the login form is shown; no product grid, add buttons, or cart button exist — nothing can be added |
| TC-16 | Negative | Invalid credentials block cart access | Submit login with wrong username/password | Error "Tên đăng nhập hoặc mật khẩu không đúng." shown; shop/cart never rendered |
| TC-17 | Negative | Empty cart message | Log in and open the cart without adding anything | Drawer shows **"Giỏ hàng trống"**; no Tổng line is displayed |
| TC-18 | Negative | No badge on empty cart | Log in and observe the 🛒 button before adding | No `cart-count` badge is rendered (count 0 is hidden) |
| TC-19 | Negative | No quantity input to abuse | Look for a quantity field/stepper to type 0, a negative number, decimals, or text | No quantity input exists; quantity changes only via +1 per "add" click, so invalid quantities cannot be entered |
| TC-20 | Negative | No decrement control | With a product at qty ≥ 2, look for a way to reduce quantity without removing the line | No decrement/minus control exists; the only reduction path is "Xoá" (removes the whole line) |
| TC-21 | Negative | No checkout/purchase action | With items in cart, look for a checkout/pay button | No checkout, payment, or order feature exists — the flow ends at cart review |
| TC-22 | Edge | Rapid repeated adds (no cap) | Click "Thêm vào giỏ" on **Kính râm** 10 times quickly | Quantity reaches exactly **10** (no stock/max cap); badge **10**; total **3.200.000₫** |
| TC-23 | Edge | Remove a line item | Add **Balo du lịch**, open cart, click **"Xoá"** | Line is removed; its button reverts to **"Thêm vào giỏ"**; badge/total update accordingly |
| TC-24 | Edge | Re-add after removal resets quantity | Add **Balo du lịch** ×2, remove it, then add it again | After re-adding, the line starts fresh at **× 1** (quantity is not resumed from before) |
| TC-25 | Edge | Remove the only item | Add exactly one product, open cart, click **"Xoá"** | Cart returns to **"Giỏ hàng trống"**; badge disappears; Tổng row is removed |
| TC-26 | Edge | Remove one of several items | Add 3 different products, remove one | Only that line is removed; remaining lines intact; badge and Tổng recalculated correctly |
| TC-27 | Edge | Reload clears the cart | Add products, then reload the page (F5) | Session ends and the login page is shown; after re-login the cart is **empty** (no persistence) |
| TC-28 | Edge | Logout clears the cart | Add products, then click **"Đăng xuất"** | Returns to login screen; after logging back in the cart is **empty** |
| TC-29 | Edge | Large-quantity total calculation | Add **Giày Sneaker** ×100 | Quantity shows **× 100**; Tổng computes to **89.900.000₫**, correctly formatted |
| TC-30 | Edge | Full catalog with mixed high quantities | Add several products at varied high quantities (e.g. Sneaker ×3, Balo ×2, Áo thun ×5) | All line subtotals and Tổng compute correctly; badge equals the sum of all quantities |
| TC-31 | Edge | Catalog boundary (no extra products) | Add all 6 products and look for any further distinct item to add | Exactly 6 distinct products are addable; there is no 7th product to add |
| TC-32 | Edge | Badge visibility boundary (0↔1) | Add one product, then remove it | Badge transitions hidden → **1** on add, then **1** → hidden on removal |