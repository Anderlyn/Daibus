import { Button, Text } from "@nextui-org/react";
import React from "react";
import "./home.css";

function home() {
  return (
    <div>
      <nav class="navbar background">
        <ul class="nav-list">
          <div class="logo">
            <img src="../img/logo.png" />
          </div>
        </ul>

        <div class="rightNav">
          <a href="/login">
            <Button>Ingresar</Button>
          </a>
        </div>
      </nav>

      <h1>
        <center>
          <img id="img" src="../img/img2134.png" />
        </center>
      </h1>

      <footer className="footer">
        <p className="text-footer">Copyright © ULACIT</p>
      </footer>
    </div>
  );
}

export default home;
