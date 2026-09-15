import { useEffect, useState } from "react";

import API, {
    login,
    logout
} from "./api";

import "./index.css";


function App() {

    // ------------------------------------------------
    // AUTH STATE
    // ------------------------------------------------

    const [isLoggedIn, setIsLoggedIn] =
        useState(
            !!localStorage.getItem("access")
        );


    const [username, setUsername] =
        useState("");


    const [password, setPassword] =
        useState("");


    const [loginError, setLoginError] =
        useState("");


    // ------------------------------------------------
    // PRODUCT STATE
    // ------------------------------------------------

    const [products, setProducts] =
        useState([]);


    const [form, setForm] =
        useState({
            name: "",
            description: "",
            price: "",
        });


    const [editingId, setEditingId] =
        useState(null);


    const [error, setError] =
        useState("");


    // ------------------------------------------------
    // LOGIN
    // ------------------------------------------------

    const handleLogin = async (event) => {

        event.preventDefault();

        setLoginError("");


        try {

            await login(
                username,
                password
            );

            setIsLoggedIn(true);

        } catch (error) {

            console.error(error);

            setLoginError(
                "Invalid username or password"
            );
        }
    };


    // ------------------------------------------------
    // GET PRODUCTS
    // ------------------------------------------------

    const fetchProducts = async () => {

        try {

            const response =
                await API.get(
                    "products/"
                );


            setProducts(
                response.data
            );


            setError("");

        } catch (error) {

            console.error(error);

            if (
                error.response?.status === 401
            ) {

                handleLogout();

            } else {

                setError(
                    "Unable to load products"
                );
            }
        }
    };


    // ------------------------------------------------
    // LOAD PRODUCTS
    // ------------------------------------------------

    useEffect(() => {

        if (isLoggedIn) {

            fetchProducts();
        }

    }, [isLoggedIn]);


    // ------------------------------------------------
    // FORM CHANGE
    // ------------------------------------------------

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm({
            ...form,
            [name]: value,
        });
    };


    // ------------------------------------------------
    // CREATE / UPDATE
    // ------------------------------------------------

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        try {

            if (editingId) {

                // UPDATE
                await API.put(
                    `products/${editingId}/`,
                    form
                );

            } else {

                // CREATE
                await API.post(
                    "products/",
                    form
                );
            }


            setForm({
                name: "",
                description: "",
                price: "",
            });


            setEditingId(null);


            await fetchProducts();

        } catch (error) {

            console.error(error);


            if (
                error.response?.status === 403
            ) {

                setError(
                    "You don't have permission. Admin access required."
                );

            } else {

                setError(
                    "Operation failed."
                );
            }
        }
    };


    // ------------------------------------------------
    // EDIT
    // ------------------------------------------------

    const handleEdit = (product) => {

        setEditingId(
            product.id
        );


        setForm({
            name: product.name,

            description:
                product.description,

            price: product.price,
        });
    };


    // ------------------------------------------------
    // DELETE
    // ------------------------------------------------

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this product?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await API.delete(
                `products/${id}/`
            );


            await fetchProducts();

        } catch (error) {

            console.error(error);


            if (
                error.response?.status === 403
            ) {

                setError(
                    "You don't have permission to delete."
                );

            } else {

                setError(
                    "Delete failed."
                );
            }
        }
    };


    // ------------------------------------------------
    // LOGOUT
    // ------------------------------------------------

    const handleLogout = () => {

        logout();

        setIsLoggedIn(false);

        setProducts([]);
    };


    // ------------------------------------------------
    // LOGIN SCREEN
    // ------------------------------------------------

    if (!isLoggedIn) {

        return (

            <div className="login-page">

                <form
                    className="login-card"
                    onSubmit={handleLogin}
                >

                    <h1>
                        Secure CRUD
                    </h1>


                    <p>
                        Login to continue
                    </p>


                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={
                            (event) =>
                                setUsername(
                                    event.target.value
                                )
                        }
                        required
                    />


                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={
                            (event) =>
                                setPassword(
                                    event.target.value
                                )
                        }
                        required
                    />


                    {loginError && (

                        <div className="error">
                            {loginError}
                        </div>

                    )}


                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>
        );
    }


    // ------------------------------------------------
    // CRUD SCREEN
    // ------------------------------------------------

    return (

        <div className="app">

            <header className="header">

                <div>

                    <h1>
                        Product Management
                    </h1>

                    <p>
                        Secure CRUD Application
                    </p>

                </div>


                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            <main>

                {/* FORM */}

                <section className="form-card">

                    <h2>

                        {editingId
                            ? "Update Product"
                            : "Add Product"
                        }

                    </h2>


                    <form
                        onSubmit={handleSubmit}
                    >

                        <input
                            name="name"
                            placeholder="Product name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />


                        <textarea
                            name="description"
                            placeholder="Description"
                            value={
                                form.description
                            }
                            onChange={handleChange}
                        />


                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />


                        <div className="form-actions">

                            <button
                                type="submit"
                            >

                                {editingId
                                    ? "Update"
                                    : "Create"
                                }

                            </button>


                            {editingId && (

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {

                                        setEditingId(
                                            null
                                        );

                                        setForm({
                                            name: "",
                                            description: "",
                                            price: "",
                                        });
                                    }}
                                >
                                    Cancel
                                </button>

                            )}

                        </div>

                    </form>

                </section>


                {/* ERROR */}

                {error && (

                    <div className="error-box">
                        {error}
                    </div>

                )}


                {/* PRODUCTS */}

                <section className="products">

                    <h2>
                        Products
                    </h2>


                    {products.length === 0 ? (

                        <div className="empty">

                            No products found.

                        </div>

                    ) : (

                        products.map(
                            (product) => (

                                <div
                                    className="product-card"
                                    key={product.id}
                                >

                                    <div>

                                        <h3>
                                            {
                                                product.name
                                            }
                                        </h3>


                                        <p>
                                            {
                                                product.description
                                            }
                                        </p>


                                        <strong>
                                            ₹
                                            {
                                                product.price
                                            }
                                        </strong>

                                    </div>


                                    <div className="actions">

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    product
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    product.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            )
                        )

                    )}

                </section>

            </main>

        </div>
    );
}


export default App;