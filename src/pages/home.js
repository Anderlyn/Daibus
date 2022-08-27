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
          <li>
            <a href="/home">Inicio</a>
          </li>
        </ul>

        <div class="rightNav">
          <button class="btn btn-sm">login</button>
          <button class="btn btn-sm">signup</button>
        </div>
      </nav>

      <h1>
        <center>
          <img src="../img/img2134.png" />
        </center>
      </h1>

      <section class="section">
        <div class="box-main">
          <div class="firstHalf">
            <h1 class="text-big">Lorem Ipsum</h1>
            <p class="text-small">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              pulvinar nisi at neque consequat tincidunt. Etiam aliquet, enim
              euismod egestas eleifend, orci eros congue turpis, at congue
              mauris diam lacinia massa. Curabitur quis nunc at arcu mollis
              suscipit. Interdum et malesuada fames ac ante ipsum primis in
              faucibus. Vivamus velit nisi, interdum non sagittis at, aliquam
              vitae sapien. Fusce volutpat sem lectus, a malesuada diam
              malesuada ac. Nam lobortis orci sed tortor iaculis, ut lobortis
              lorem mollis. Praesent venenatis sollicitudin quam, eget euismod
              augue bibendum rhoncus. Vivamus sed leo sit amet nisl vestibulum
              fermentum. Morbi eget laoreet metus. Vivamus tincidunt nec dui
              quis tincidunt. Nullam sit amet dolor vitae lectus consectetur
              consequat semper vitae augue.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p className="text-footer">Copyright ©-All rights are reserved</p>
      </footer>
    </div>
  );
}

export default home;
