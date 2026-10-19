import { expect, test } from "@playwright/test";

const adminSession = {
  id: "smoke-admin",
  email: "admin@example.com",
  name: "Smoke Admin",
  username: "smoke-admin",
  role: "ADMIN",
  merchantId: "smoke-merchant",
  merchant: {
    id: "smoke-merchant",
    name: "Loja da Mili",
    code: "loja-da-mili",
  },
};

const superAdminSession = {
  id: "smoke-super-admin",
  email: "super-admin@example.com",
  name: "Smoke Super Admin",
  username: "smoke-super-admin",
  role: "SUPER_ADMIN",
};

const screens = [
  { path: "/", heading: "Acesso rápido", session: adminSession },
  { path: "/pedidos", heading: "Pedidos", session: adminSession },
  { path: "/produtos", heading: "Produtos", session: adminSession },
  { path: "/categorias", heading: "Categorias", session: adminSession },
  { path: "/destaques", heading: "Produtos em Destaque", session: adminSession },
  { path: "/clientes", heading: "Clientes", session: adminSession },
  { path: "/variantes", heading: "Variantes", session: adminSession },
  { path: "/roadmap", heading: "Loja da Mili", session: adminSession },
  { path: "/lojas", heading: "Lojas", session: superAdminSession },
];

test.describe("telas administrativas", () => {
  for (const screen of screens) {
    test(`abre ${screen.path} sem erros`, async ({ page }) => {
      const runtimeErrors: string[] = [];

      page.on("pageerror", (error) => runtimeErrors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") {
          runtimeErrors.push(message.text());
        }
      });

      await page.addInitScript(() => {
        window.localStorage.setItem("auth:authenticated", "true");
      });

      await page.route("**/api/**", (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "[]",
        }),
      );

      await page.route("**/auth/me", (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(screen.session),
        }),
      );

      await page.goto(screen.path);

      await expect(
        page.getByRole("heading", { name: screen.heading, exact: true }),
      ).toBeVisible();
      expect(runtimeErrors).toEqual([]);
    });
  }
});
