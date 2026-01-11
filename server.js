const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Store connected players
let connectedPlayers = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When a player joins
    socket.on('playerJoin', (playerName) => {
        const player = {
            id: socket.id,
            name: playerName
        };
        
        connectedPlayers.push(player);
        console.log(`${playerName} joined. Total players: ${connectedPlayers.length}`);

        // Send updated player list to all clients
        io.emit('updatePlayers', connectedPlayers);
    });

    // When a player answers a question
    socket.on('answerQuestion', (data) => {
        // Broadcast to all clients that a player answered
        io.emit('playerAnswered', {
            playerId: socket.id,
            playerName: data.playerName,
            question: data.questionIndex,
            answer: data.answer
        });
    });

    // When a player moves to next question
    socket.on('nextQuestion', (data) => {
        io.emit('playerProgressed', {
            playerId: socket.id,
            playerName: data.playerName,
            questionIndex: data.questionIndex
        });
    });

    // When a player disconnects
    socket.on('disconnect', () => {
        const playerIndex = connectedPlayers.findIndex(p => p.id === socket.id);
        if (playerIndex !== -1) {
            const playerName = connectedPlayers[playerIndex].name;
            connectedPlayers.splice(playerIndex, 1);
            console.log(`${playerName} disconnected. Total players: ${connectedPlayers.length}`);
            
            // Send updated player list to all remaining clients
            io.emit('updatePlayers', connectedPlayers);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
