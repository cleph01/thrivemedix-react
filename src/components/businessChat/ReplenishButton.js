import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { db } from "../../utils/db/firebaseConfig";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import {
    createCheckoutSession,
    getStripePayments,
} from "@stripe/firestore-stripe-payments";
import { getApp } from "firebase/app";

const ReplenishButton = ({ user }) => {
    const [hasSubscription, setHasSubscription] = useState(false);

    // Helper function to execute on ComponentMount (useEffect)
    const fetchSubscription = async () => {
        const subscriptionsQuery = query(
            collection(db, `users/${user.id}/subscriptions`)
        );

        const querySnapshot = await getDocs(subscriptionsQuery);

        if (querySnapshot.docs[0]?.status === "active") {
            setHasSubscription(true);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    return <ProductSelector hasSubscription={true} />;
};

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        message: state.message.message,
    };
};

export default connect(mapStateToProps, {})(ReplenishButton);
//
//
//
//
const ProductSelector = ({ hasSubscription }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({ priceId: "" });
    const [checkoutSessionLoading, setCheckoutSessionLoading] = useState();

    console.log("has monthly sub: ", hasSubscription);

    // create Stripe instance
    const app = getApp();
    const payments = getStripePayments(app, {
        productsCollection: "products",
        customersCollection: "users",
    });

    // handle Submit Checkout Doc to DB (Stripe Extension)
    const handleSubmitCheckout = async () => {
        if (!!!selectedProduct.priceId) {
            alert("Select an SMS package first");
        } else {
            // execute checkout
            setCheckoutSessionLoading(true);
            // Check if package being bought is the monthly subscription or
            // the client already is subscribed and is buying a package of SMS
            // * important because its different data to be passed to
            // * stripe checkout collection document
            if (selectedProduct.productName === "Monthly Subscription") {
                setCheckoutSessionLoading(true);

                const paymentData = {
                    price: selectedProduct.priceId,
                    success_url: window.location.origin,
                    cancel_url: window.location.origin,
                };

                const session = await createCheckoutSession(
                    payments,
                    paymentData
                );

                if (session.url) {
                    setCheckoutSessionLoading(false);
                    window.location.assign(session.url);
                }
            } else {
                const paymentData = {
                    mode: "payment",
                    price: selectedProduct.priceId,
                    success_url: window.location.origin,
                    cancel_url: window.location.origin,
                };

                const session = await createCheckoutSession(
                    payments,
                    paymentData
                );

                if (session.url) {
                    setCheckoutSessionLoading(false);
                    window.location.assign(session.url);
                }
            }
        }
    };

    // Helper function to get the product priceIds -> execute on ComponentMount (useEffect)
    const fetchProducts = async (hasSubscription = true) => {
        // Start by getting product Ids
        const productsQuery = query(
            collection(db, "products"),
            where(
                "name",
                hasSubscription ? "!=" : "==",
                "Monthly Subscription"
            ),
            where("active", "==", true)
        );

        const productQuerySnapshot = await getDocs(productsQuery);

        console.log("productQuery: ", productQuerySnapshot.docs);
        // No loop thru ea. product and get the price Ids

        productQuerySnapshot.forEach(async (product) => {
            const priceCollRef = collection(
                db,
                `products/${product.id}/prices`
            );

            const priceSnapshot = await getDocs(priceCollRef);

            console.log("priceQuery: ", priceSnapshot.docs);

            priceSnapshot.docs.forEach((price) => {
                setProducts((prev) => [
                    ...prev,
                    {
                        priceId: price.id,
                        productName: product.data().name,
                        ...price.data(),
                    },
                ]);
            });
        });
    };

    // Handle Product Selection Change
    const handleChange = (event) => {
        setSelectedProduct(
            products.find((product) => product.priceId === event.target.value)
        );
    };

    useEffect(() => {
        fetchProducts();
    }, [hasSubscription]);
    console.log("selected product: ", selectedProduct);
    console.log("products at ReplenishButton: ", products);
    return (
        <Container>
            <Box sx={{ minWidth: 120, maxHeight: 350 }}>
                <FormControl>
                    <InputLabel
                        id="demo-simple-select-label"
                        sx={{ fontSize: "1.2rem" }}
                    >
                        SMS Package
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue=""
                        value={selectedProduct.priceId}
                        label="SMS Package"
                        onChange={handleChange}
                        sx={{ fontSize: "1.6rem", width: "11.5rem" }}
                    >
                        {products
                            ?.filter((product) => product.unit_amount !== 30000)
                            .sort((a, b) => a.unit_amount - b.unit_amount)
                            .map((product) => (
                                <MenuItem
                                    sx={{ fontSize: "1.2rem" }}
                                    key={product?.priceId}
                                    value={product?.priceId}
                                >
                                    {product?.productName}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Box>
            <Button
                onClick={handleSubmitCheckout}
                disabled={checkoutSessionLoading}
                style={{ fontSize: "1.2rem" }}
            >
                Pay $
                {selectedProduct.priceId
                    ? String(selectedProduct.unit_amount).slice(0, -2)
                    : " --"}
                {checkoutSessionLoading && (
                    <CircularProgress
                        style={{
                            marginLeft: "10px",
                            width: "20px",
                            height: "auto",
                        }}
                    />
                )}
            </Button>
        </Container>
    );
};

const BuyButton = styled.div`
    padding: 1rem;
    border: 1px solid;
    border-radius: 1rem;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;
