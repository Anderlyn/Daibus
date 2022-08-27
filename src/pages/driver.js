import React, { useContext, useEffect, useState } from "react";
import FirebaseContext from "./context/FirebaseContext";
import {
  Card,
  Input,
  Text,
  Spacer,
  Button,
  Grid,
  Loading,
  Modal,
  useModal,
  Table,
} from "@nextui-org/react";
import {
  addDoc,
  collection,
  getFirestore,
  query,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import useUser from "./hooks/useUser";
import "./admin.css";
import correct from "../assets/verified.gif";
import wrong from "../assets/alarm.gif";

import QrReader from "react-qr-scanner";

const Driver = () => {
  const auth = getAuth();
  const firebase = useContext(FirebaseContext);
  const userState = useUser();
  const db = getFirestore(firebase);

  const { setVisible, bindings } = useModal();
  const [ticketPlace, setTicketPlace] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleScan = (result) => {
    if (!result && !result?.text?.includes("DAIBUSCR")) return;
    const ticketValue = result?.text.split("DAIBUSCR");
    if (!ticketValue) return;
    const ticketId = ticketValue[0];
    verifyTicket(ticketId);
  };

  const verifyTicket = async (ticketId) => {
    const ref = doc(db, "tiquetes", ticketId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      console.log(data);
      if (!data.used) {
        setTicketPlace(data.route_name);
        setTimeout(() => {
          updateDoc(ref, {
            used: true,
          });
        }, 1000);
      } else {
        setTicketPlace(null);
      }
    } else {
      setTicketPlace(null);
    }
    setVisible(true);
    setOpenModal(true);
  };

  const handleErrors = (error) => {
    console.error(error);
  };
  return (
    <div className="admin_container">
      <Modal
        onCloseButtonClick={() => {
          window.location.reload();
        }}
        closeButton
        aria-labelledby="modal-title"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            <Text size={18}>Resultado de Escaneo</Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <img
            src={ticketPlace !== null ? correct : wrong}
            style={{ width: 250, margin: "0 auto" }}
          />
          <Text id="modal-title" css={{ textAlign: "center" }} size={18}>
            <Text color={ticketPlace ? "green" : "red"} i size={20}>
              {ticketPlace !== null ? "Tiquete valido." : "Tiquete usado."}
            </Text>
            <br />
            <Text b size={23}>
              {ticketPlace !== null ? ticketPlace : "-"}
            </Text>
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Text i size={12}>
            ULACIT 2022.
          </Text>
        </Modal.Footer>
      </Modal>
      <Grid.Container alignItems="center" justify="center">
        <Grid>
          <Text
            h3
            size={32}
            css={{
              textGradient: "45deg, $green600 -20%, $yellow600 100%",
              margin: 0,
              textAlign: "center",
            }}
            weight="bold"
          >
            Daibus@Driver
          </Text>
          <Button
            onClick={() => {
              signOut(auth);
            }}
            color="secondary"
            auto
            css={{
              margin: "0 auto",
            }}
            size="md"
          >
            Salir
          </Button>
        </Grid>
      </Grid.Container>
      <Spacer y={1} />
      <Grid.Container justify="center" css={{ height: 250 }}>
        <Card css={{ padding: 50 }}>
          <Text h3 size={20} weight="bold" css={{ textAlign: "center" }}>
            Escanear QR.
          </Text>
          <Spacer y={1} />
          <Grid.Container justify="center">
            <QrReader
              onError={handleErrors}
              onScan={handleScan}
              delay={3500}
              style={{ height: 260, width: 260 }}
            />
          </Grid.Container>
        </Card>
      </Grid.Container>
      <Text css={{ textAlign: "center", marginTop: "50px" }}>
        <b>Daibus CR © 2022</b>
      </Text>
    </div>
  );
};

export default Driver;
