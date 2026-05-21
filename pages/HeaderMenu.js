const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

/**
 * Sticky header present on every authenticated page.
 * Owns the burger menu, cart icon and (where relevant) the cart badge.
 */
class HeaderMenu extends BasePage {
    constructor(page) {
        super(page);
        this.burgerButton = page.locator("#react-burger-menu-btn");
        this.closeMenuButton = page.locator("#react-burger-cross-btn");
        this.menuLinks = page.locator(".bm-item-list a");
        this.logoutLink = page.locator("#logout_sidebar_link");
        this.cartIcon = page.locator("#shopping_cart_container");
        this.cartBadge = page.locator(".shopping_cart_badge");
    }

    async openMenu() {
        await this.burgerButton.click();
        await expect(this.menuLinks.first()).toBeVisible();
    }

    async logout() {
        await this.openMenu();
        await this.logoutLink.click();
    }

    async openCart() {
        await this.cartIcon.click();
    }

    async expectCartBadge(count) {
        if (count === 0) {
            await expect(this.cartBadge).toBeHidden();
        } else {
            await expect(this.cartBadge).toHaveText(String(count));
        }
    }
}

module.exports = { HeaderMenu };
