"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./globals.css";

let socket;

export default function Home() {

    const socketInitializer = async () => {

        await fetch("/api/socket");

        socket = io(undefined, {
            path: "/api/my_awesome_socket",
        });

        socket.on("connect", () => {
            console.log("Connected", socket.id);
        });

    };

    useEffect(() => {
        socketInitializer();
    }, []);

    return null;
}