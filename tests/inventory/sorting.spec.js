const { test, expect } = require("../../fixtures/test");
const {
    applyLabels,
    step,
    FEATURE,
    STORY,
    SEVERITY,
    TAG,
} = require("../../fixtures/allure");
const { SORT_OPTIONS } = require("../../fixtures/data");

test.describe("Inventory | Sorting", { tag: [TAG.inventory, TAG.regression] }, () => {
    test.beforeEach(async ({ inventoryPage }) => {
        applyLabels({
            feature: FEATURE.inventory,
            story: STORY.sortProducts,
            severity: SEVERITY.normal,
            suite: "Inventory",
            subSuite: "Sorting",
        });
        await step("Open the products catalogue", async () => {
            await inventoryPage.open();
            await inventoryPage.expectLoaded();
        });
    });

    test("Products sort A→Z by name", async ({ inventoryPage }) => {
        await step("Select 'Name (A to Z)'", () => inventoryPage.sortBy(SORT_OPTIONS.nameAsc));
        await step("Names are in ascending alphabetical order", async () => {
            const names = await inventoryPage.getItemNames();
            expect(names).toEqual([...names].sort());
        });
    });

    test("Products sort Z→A by name", async ({ inventoryPage }) => {
        await step("Select 'Name (Z to A)'", () => inventoryPage.sortBy(SORT_OPTIONS.nameDesc));
        await step("Names are in descending alphabetical order", async () => {
            const names = await inventoryPage.getItemNames();
            expect(names).toEqual([...names].sort().reverse());
        });
    });

    test("Products sort from cheapest to most expensive", async ({ inventoryPage }) => {
        await step("Select 'Price (low to high)'", () =>
            inventoryPage.sortBy(SORT_OPTIONS.priceAsc),
        );
        await step("Prices are in ascending numeric order", async () => {
            const prices = await inventoryPage.getItemPrices();
            expect(prices).toEqual([...prices].sort((a, b) => a - b));
        });
    });

    test("Products sort from most expensive to cheapest", async ({ inventoryPage }) => {
        await step("Select 'Price (high to low)'", () =>
            inventoryPage.sortBy(SORT_OPTIONS.priceDesc),
        );
        await step("Prices are in descending numeric order", async () => {
            const prices = await inventoryPage.getItemPrices();
            expect(prices).toEqual([...prices].sort((a, b) => b - a));
        });
    });
});
