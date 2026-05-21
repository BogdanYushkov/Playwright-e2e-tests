/**
 * Centralised test data. Keep selectors out of here — they belong to
 * Page Objects. This file is only for inputs, expected values and URLs.
 */

const USERS = {
    standard: { username: "standard_user", password: "secret_sauce" },
    locked: { username: "locked_out_user", password: "secret_sauce" },
    problem: { username: "problem_user", password: "secret_sauce" },
    glitch: { username: "performance_glitch_user", password: "secret_sauce" },
};

const PRODUCTS = {
    backpack: { id: "sauce-labs-backpack", name: "Sauce Labs Backpack", price: 29.99 },
    bikeLight: { id: "sauce-labs-bike-light", name: "Sauce Labs Bike Light", price: 9.99 },
    boltTshirt: { id: "sauce-labs-bolt-t-shirt", name: "Sauce Labs Bolt T-Shirt", price: 15.99 },
};

const SORT_OPTIONS = {
    nameAsc: "az",
    nameDesc: "za",
    priceAsc: "lohi",
    priceDesc: "hilo",
};

const URLS = {
    login: "/",
    inventory: "/inventory.html",
    cart: "/cart.html",
    checkoutStepOne: "/checkout-step-one.html",
    checkoutStepTwo: "/checkout-step-two.html",
    checkoutComplete: "/checkout-complete.html",
};

const CHECKOUT_INFO = {
    firstName: "Bogdan",
    lastName: "QA",
    postalCode: "02011",
};

const ERROR_MESSAGES = {
    invalidCredentials: "Username and password do not match any user in this service",
    lockedOut: "Sorry, this user has been locked out",
};

module.exports = {
    USERS,
    PRODUCTS,
    SORT_OPTIONS,
    URLS,
    CHECKOUT_INFO,
    ERROR_MESSAGES,
};
