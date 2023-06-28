"use strict"

const express = require("express");
const uuid = require("uuid");

const port = 3000;
const app = express();
app.use(express.json());

const orders = [];

const checkUserId = (req, resp, next) => {
    const { id } = req.params;

    const index = orders.findIndex((user) => user.id === id);

    if (index < 0) {
        return resp.status(404).json({ menssagem: "User not found" });
    }

    req.userIndex = index;
    req.userId = id;

    next();
};

const middlewareVerbs = (request, response, next) => {
    console.log(`[${request.method}] - ${request.url}`);
    next();
};

app.get("/order", (req, resp) => {
    return resp.json(orders);
});

app.post("/order", (req, resp) => {
    const { order, clientName, price, status } = req.body;
    const user = { id: uuid.v4(), order, clientName, price, status };

    orders.push(user);
    return resp.json(user);
});


app.put("/order/:id", checkUserId, middlewareVerbs, (req, resp) => {
    const { order, clientName, price, status } = req.body;
    const index = req.userIndex;
    const id = req.userId;
    const updateOrder = { id, order, clientName, price, status };
    orders[index] = updateOrder;
    return resp.json(updateOrder);
});

app.delete("/order/:id", checkUserId, middlewareVerbs, (req, resp) => {
    const index = req.userIndex;

    orders.splice(index, 1);

    return resp.status(204).json();
});

app.patch("/order/:id", checkUserId, middlewareVerbs, (req, resp) => {
    const id = req.userId;

    const newStatus = orders.filter((e) => e.id === id);
    newStatus.map((e) => {
        const news = {
            id: e.id,
            orders: e.orders,
            clientName: e.clientName,
            price: e.price,
            status: "Pedido Pronto"
        };
        return resp.json(news);
    });
});

app.listen(port, () => {
    console.log(`🚀 Load in port ${port}`);
});
