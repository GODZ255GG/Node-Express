import express from 'express';
import fs from "fs";
import bodyParser from "body-parser"; //middlaware

const app = express();
app.use(bodyParser.json());

const readData = () =>{
    try {
        const data = fs.readFileSync("./dbUsuarios.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./dbUsuarios.json", JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
};

app.get("/", (rep, res) => {
    res.send("Bienvenido a mi primera API con Node js!");
});

//Endpoint para ver los datos del libro en el localhost:8080/books
app.get("/Usuarios", (req, res) =>{
    const data = readData();
    res.json(data.Usuarios);
});

//Endpoint de crear nuevos usuarios
app.post("/Usuarios", (req, res) =>{
    const data = readData();
    const body = req.body;
    const newUsuario = {
        id: data.Usuarios.length + 1,
        ...body,
    };
    data.Usuarios.push(newUsuario);
    writeData(data);
    res.json(newUsuario);
});

//Endpoint para buscar por id
app.get("/Usuarios/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const usuario = data.Usuarios.find((usuario) => usuario.id === id);
    res.json(usuario);
});

//Endpoint para actualizar el usuario
app.put("/Usuarios/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const usuarioIndex = data.Usuarios.findIndex((usuario) => usuario.id === id);
    data.Usuarios[usuarioIndex] = {
        ...data.Usuarios[usuarioIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Usuario actualizado correctamente" });
});

//Endpoint para eliminar el usuario
app.delete("/Usuarios/:id", (req, res) =>{
    const data = readData();
    const id = parseInt(req.params.id);
    const usuarioIndex = data.Usuarios.findIndex((usuario) => usuario.id === id);
    data.Usuarios.splice(usuarioIndex, 1);
    writeData(data);
    res.json({ message: "Usuario eliminado correctamente" });
});

app.listen(8080, () =>{
    console.log('Servidor eschuchando en el puerto 8080');
});