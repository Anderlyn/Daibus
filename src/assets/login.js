import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Input,
  Text,
  Spacer,
  Button,
  Grid,
  Loading,
} from "@nextui-org/react";
import "./login.css";
import FirebaseContext from "./context/FirebaseContext";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import bus from "../assets/bus.gif";

export default function Login() {
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const firebase = useContext(FirebaseContext);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.email.includes("usuario")) window.location.href = "/user";
      if (user.currentUser.email.includes("conductor"))
        window.location.href = "/driver";
      if (auth.currentUser.includes("admin")) window.location.href = "/admin";
    }
  });

  const submitForm = async () => {
    setIsLoading(true);
    setErrorMessage("");
    if (username === "" && password === "") {
      setErrorMessage("Por favor, llene todos los campos.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );

      const user = userCredential.user;
      if (user.email.includes("usuario")) window.location.href = "/user";
      if (user.email.includes("conductor")) window.location.href = "/driver";
      if (user.email.includes("admin")) window.location.href = "/admin";
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMessage("Ingresa un correo valido.");
          break;
        case "auth/user-not-found":
          setErrorMessage("Usuario no registrado.");
          break;
        default:
          setErrorMessage(
            "El servidor esta presentando un par de errores, intentalo luego."
          );
      }
    }
  };

  return (
    <div className="login_container">
      <Card css={{ width: 450 }}>
        <Card.Header css={{ justifyContent: "center" }}>
          <img
            src={bus}
            height="150"
            width="150"
            css={{
              margin: "0 auto",
            }}
          ></img>
        </Card.Header>
        <Card.Body
          css={{
            padding: 70,
            paddingTop: 0,
          }}
        >
          <Text
            h3
            size={44}
            css={{
              textGradient: "45deg, $blue600 -20%, $purple400 100%",
              margin: 0,
              textAlign: "center",
            }}
            weight="bold"
          >
            Daibus
          </Text>
          <Text css={{ textAlign: "center", opacity: 0.5 }}>
            Bienvenido(a) al Sistema.
          </Text>

          <Spacer y={1} />
          <Input
            label="Correo"
            type="text"
            disabled={isLoading}
            onChange={(event) => setUsername(event.target.value)}
          />
          <Spacer y={0.7} />
          <Input
            label="Contraseña"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoading}
          />
          <Text css={{ textAlign: "center", color: "red" }}>
            {errorMessage}
          </Text>
          <Spacer y={1} />

          <Grid>
            <Button
              onClick={submitForm}
              css={{ margin: "0 auto" }}
              color="primary"
              auto
            >
              {isLoading ? (
                <Loading type="points-opacity" color="currentColor" size="sm" />
              ) : (
                "Ingresar"
              )}
            </Button>
          </Grid>
        </Card.Body>
      </Card>
    </div>
  );
}
