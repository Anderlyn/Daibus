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
  Table,
  Modal,
  useModal,
} from "@nextui-org/react";
import {
  addDoc,
  collection,
  getFirestore,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import { getAuth, signOut } from "firebase/auth";
import useUser from "./hooks/useUser";
import "./user.css";

const User = () => {
  const auth = getAuth();
  const firebase = useContext(FirebaseContext);
  const userState = useUser();
  const db = getFirestore(firebase);
  const [newTicket, setNewTicket] = useState(false);
  const { setVisible, bindings } = useModal();
  const [actualVisibleTicket, setActualVisibleTicket] = useState();

  const RouteList = () => {
    const [routesLoading, setRoutesLoading] = useState(true);
    const [routes, setRoutes] = useState([]);

    const fetchRoutes = async () => {
      setRoutesLoading(true);
      const q = query(collection(db, "rutas"));
      const querySnapshot = await getDocs(q);
      const newRoutesArray = new Array();
      querySnapshot.forEach((route) => {
        newRoutesArray.push({ ...route.data(), id: route.id });
      });
      setRoutesLoading(false);
      setRoutes(newRoutesArray);
    };

    const getTodayDate = () => {
      let today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      return dd + "/" + mm + "/" + yyyy;
    };

    const buyRoute = async (id, name) => {
      setRoutesLoading(true);
      const todaysDate = getTodayDate();
      const ticket = await addDoc(collection(db, "tiquetes"), {
        route: id,
        date: todaysDate,
        route_name: name,
        used: false,
      });
      setActualVisibleTicket({
        route: id,
        date: todaysDate,
        route_name: name,
        id: ticket.id,
      });
      setVisible(true);
      setNewTicket(true);
    };

    useEffect(() => {
      fetchRoutes();
    }, []);

    return (
      <>
        {routesLoading ? (
          <>
            <Spacer y={4} />
            <Loading
              css={{ fontSize: 11 }}
              color="secondary"
              type="points"
              size="lg"
            >
              Cargando Rutas
            </Loading>
            <Spacer y={4} />
          </>
        ) : (
          <Table striped>
            <Table.Header>
              <Table.Column>NOMBRE</Table.Column>
              <Table.Column>PRECIO</Table.Column>
              <Table.Column>CONTROLES</Table.Column>
            </Table.Header>
            <Table.Body>
              {routes.map((route, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{route.name}</Table.Cell>
                  <Table.Cell>₡{route.price}</Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => {
                        buyRoute(route.id, route.name);
                      }}
                      color="secondary"
                      size="sm"
                      css={{ maxWidth: "30px" }}
                    >
                      Comprar
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </>
    );
  };

  const TicketsList = () => {
    const [ticketsLoading, setTicketsLoading] = useState(true);
    const [tickets, setTickets] = useState([]);

    const fetchTickets = async () => {
      setTicketsLoading(true);
      const q = query(collection(db, "tiquetes"), where("used", "==", false));
      const querySnapshot = await getDocs(q);
      const newTicketsArray = new Array();
      querySnapshot.forEach((ticket) => {
        newTicketsArray.push({ ...ticket.data(), id: ticket.id });
      });
      setTicketsLoading(false);
      setTickets(newTicketsArray);
    };

    useEffect(() => {
      fetchTickets();
    }, []);

    useEffect(() => {
      if (newTicket) fetchTickets();
    }, [newTicket]);

    const seeTicket = (data) => {
      setActualVisibleTicket(data);
      setVisible(true);
    };

    return (
      <>
        {ticketsLoading ? (
          <>
            <Spacer y={4} />
            <Loading
              css={{ fontSize: 11 }}
              color="secondary"
              type="points"
              size="lg"
            >
              Cargando Tiquetes
            </Loading>
            <Spacer y={4} />
          </>
        ) : (
          <Table striped>
            <Table.Header>
              <Table.Column>NOMBRE</Table.Column>
              <Table.Column>FECHA</Table.Column>
              <Table.Column>VER</Table.Column>
            </Table.Header>
            <Table.Body>
              {tickets.map((ticket, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{ticket.route_name}</Table.Cell>
                  <Table.Cell>{ticket.date}</Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => {
                        seeTicket(ticket);
                      }}
                      color="primary"
                      size="sm"
                      css={{ maxWidth: "30px" }}
                    >
                      Ver
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </>
    );
  };

  return (
    <div className="admin_container">
      <Modal closeButton aria-labelledby="modal-title" {...bindings}>
        <Modal.Header>
          <Text id="modal-title" size={18}>
            <Text b size={18}>
              Tu Tiquete
            </Text>
            <Text size={22}>
              {actualVisibleTicket?.route_name} - {actualVisibleTicket?.date}
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <QRCodeSVG
            className="user__qr"
            size={250}
            value={`${actualVisibleTicket?.id}DAIBUSCR${actualVisibleTicket?.route}`}
          />
        </Modal.Body>
        <Modal.Footer>
          <Text i size={12}>
            {actualVisibleTicket?.id}
          </Text>
        </Modal.Footer>
      </Modal>
      <Grid.Container alignItems="center" justify="space-between">
        <Text
          h3
          size={44}
          css={{
            textGradient: "45deg, $purple600 -20%, $blue600 100%",
            margin: 0,
            marginRight: 30,
          }}
          weight="bold"
        >
          Daibus@User
        </Text>

        <Button
          onClick={() => {
            signOut(auth);
          }}
          size="lg"
          color="secondary"
          auto
        >
          Salir
        </Button>
      </Grid.Container>
      <Spacer y={1} />
      <Grid.Container justify="center" gap={1}>
        <Grid xs={8} className="admin_card_1">
          <Card className="admin__route__table">
            <Card.Header css={{ margin: "0", padding: "0" }}>
              <Text h3 color="" css={{ margin: "0" }}>
                Rutas Disponibles
              </Text>
            </Card.Header>
            <RouteList />
          </Card>
        </Grid>
        <Grid xs={3} className="admin_card_2">
          <Card className="admin__route__table">
            <Card.Header css={{ margin: "0", padding: "0" }}>
              <Text h3 color="" css={{ margin: "0" }}>
                Tickets Comprados
              </Text>
            </Card.Header>
            <TicketsList />
          </Card>
        </Grid>
      </Grid.Container>
      <Text css={{ textAlign: "center", marginTop: "50px" }}>
        <b>Daibus CR © 2022</b>
      </Text>
    </div>
  );
};

export default User;
