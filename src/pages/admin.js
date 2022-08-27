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
} from "@nextui-org/react";
import {
  addDoc,
  collection,
  getFirestore,
  query,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import useUser from "./hooks/useUser";
import "./admin.css";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const Admin = () => {
  const auth = getAuth();
  const firebase = useContext(FirebaseContext);
  const userState = useUser();
  const db = getFirestore(firebase);
  const [newRoute, setNewRoute] = useState(false);

  const [addingRoute, setAddingRoute] = useState(false);
  const [globalRoutes, setGlobalRoutes] = useState([]);

  const RouteCover = () => {
    return (
      <>
        <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
          <Text h3 color="white">
            Crear Ruta
          </Text>
        </Card.Header>
        <Card.Image
          src="https://media.istockphoto.com/illustrations/wireframe-of-grand-tour-bus-moving-fast-on-a-dark-blue-background-illustration-id1295087557?k=20&m=1295087557&s=612x612&w=0&h=jd3QXna13LYUU6xA3m3GZhiw223axU-eg0FS7-P_vyQ="
          width="100%"
          height={340}
          objectFit="cover"
          alt="Card image background"
        />
      </>
    );
  };

  const RouteForm = () => {
    const [routeName, setRouteName] = useState("");
    const [routePrice, setRoutePrice] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const submitRoute = async () => {
      setIsSaving(true);
      if (routeName === "" || routePrice === "") {
        setIsSaving(false);
        setError("Por favor, llene todos los valores.");
        return;
      }
      if (Number(routePrice) <= 0) {
        setIsSaving(false);
        setError("El precio debe ser numerico y superior a 0");
        return;
      }
      try {
        await addDoc(collection(db, "rutas"), {
          name: routeName,
          price: Number(routePrice),
        });
        setIsSaving(false);
        setAddingRoute(false);
        setNewRoute(true);
      } catch (error) {
        setError("No se pudo guardar.");
        console.error(error);
      }
    };

    return (
      <Card className="admin__route__form">
        <Text
          h3
          size={24}
          css={{
            textGradient: "45deg, $blue600 -20%, $purple600 100%",
            margin: 0,
          }}
          weight="bold"
        >
          Nueva Ruta
        </Text>
        <Spacer y={0.5}></Spacer>
        <Text
          h3
          size={16}
          css={{
            margin: 0,
          }}
        >
          Nombre de la Ruta
        </Text>
        <Input
          type="text"
          onChange={(event) => setRouteName(event.target.value)}
        />
        <Spacer y={0.2}></Spacer>
        <Text
          h3
          size={16}
          css={{
            margin: 0,
          }}
        >
          Precio de la Ruta
        </Text>

        <Input
          type="number"
          onChange={(event) => setRoutePrice(event.target.value)}
        />
        <Spacer y={1}></Spacer>
        <Button disabled={isSaving} onClick={() => submitRoute()}>
          {isSaving ? (
            <Loading type="points-opacity" color="currentColor" size="sm" />
          ) : (
            "Guardar"
          )}
        </Button>
        <Text css={{ textAlign: "center", color: "red" }}>{error}</Text>
      </Card>
    );
  };

  const RouteList = () => {
    const [routesLoading, setRoutesLoading] = useState(true);
    const [routes, setRoutes] = useState([]);
    const [firstFetch, setFirstFetch] = useState(true);

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

    const deleteRoute = async (id) => {
      setRoutesLoading(true);
      await deleteDoc(doc(db, "rutas", id));
      fetchRoutes();
    };

    useEffect(() => {
      if (firstFetch) fetchRoutes();
      setFirstFetch(false);
    }, [firstFetch]);

    useEffect(() => {
      if (newRoute) fetchRoutes();
    }, [newRoute]);

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
                        deleteRoute(route.id);
                      }}
                      color="error"
                      size="sm"
                      css={{ maxWidth: "30px" }}
                    >
                      Eliminar
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

  const RouteGraphic = () => {
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [tickets, setTickets] = useState();
    const [chartData, setChartData] = useState();

    const fetchTickets = async () => {
      setLoadingTickets(true);
      const q = query(collection(db, "tiquetes"));
      const querySnapshot = await getDocs(q);
      const newTicketsArray = new Array();
      querySnapshot.forEach((ticket) => {
        newTicketsArray.push({ ...ticket.data(), id: ticket.id });
      });
      setLoadingTickets(false);
      console.log(newTicketsArray);
      setTickets(newTicketsArray);

      let newDataset = {
        label: "Tickets Comprados",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWitdh: 4,
      };
      let newLabels = [];

      newTicketsArray.forEach((tickets) => {
        if (newLabels.indexOf(tickets.route_name) !== -1) {
          newDataset.data[newLabels.indexOf(tickets.route_name)] =
            newDataset.data[newLabels.indexOf(tickets.route_name)] + 1;
        } else {
          newDataset.data.push(1);
          newLabels.push(tickets.route_name);
          newDataset.backgroundColor.push("rgba(54, 162, 235, 0.2");
          newDataset.borderColor.push("rgb(54, 162, 235)");
        }
      });

      setChartData({
        labels: newLabels,
        datasets: [newDataset],
      });
    };

    useEffect(() => {
      fetchTickets();
    }, []);

    return (
      <>
        {loadingTickets ? (
          <>
            <Spacer y={4} />
            <Loading
              css={{ fontSize: 11 }}
              color="secondary"
              type="points"
              size="lg"
            >
              Cargando Estadisticas
            </Loading>
            <Spacer y={4} />
          </>
        ) : (
          <Bar height={50} data={chartData} />
        )}
      </>
    );
  };

  return (
    <div className="admin_container">
      <Grid.Container alignItems="center" justify="space-between">
        <Grid>
          <Text
            h3
            size={44}
            css={{
              textGradient: "45deg, $yellow600 -20%, $red600 100%",
              margin: 0,
              marginRight: 30,
            }}
            weight="bold"
          >
            Daibus@Admin
          </Text>
        </Grid>
        <Button
          onClick={() => {
            signOut(auth);
          }}
          color="secondary"
          auto
          size="lg"
        >
          Salir
        </Button>
      </Grid.Container>
      <Spacer y={1} />
      <Grid.Container justify="center" gap={1}>
        <Grid className="admin_card_1" xs={8}>
          <Card className="admin__route__table">
            <Card.Header css={{ margin: "0", padding: "0" }}>
              <Text h3 color="" css={{ margin: "0" }}>
                Estadisticas de Rutas
              </Text>
            </Card.Header>
            <RouteGraphic />
          </Card>
        </Grid>
        <Grid className="admin_card_2" xs={3}>
          {addingRoute ? (
            <RouteForm />
          ) : (
            <Card
              isPressable
              onClick={() => {
                setAddingRoute(true);
              }}
            >
              <RouteCover />
            </Card>
          )}
        </Grid>
      </Grid.Container>
      <Grid.Container justify="center">
        <Grid className="admin_card_3" xs={11}>
          <Card className="admin__route__table">
            <Text h3 color="" css={{ margin: "0" }}>
              Rutas Disponibles
            </Text>
            <RouteList />
          </Card>
        </Grid>
      </Grid.Container>
      <Text css={{ textAlign: "center", marginTop: "50px" }}>
        <b>Daibus CR © 2022</b>
      </Text>
    </div>
  );
};

export default Admin;
