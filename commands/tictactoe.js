const { formatMessage } = require('../fomatter')

// Store waiting players by chat type
let waitingPlayers = {}   // { chatId: { player, pushName } }
// Store active games by chatId
let games = {}            // { chatId: { players: [id1, id2], pushNames: [name1, name2], symbols: ['Γ£û∩╕Å','Γ¡ò'], turnIndex, board: [] } }

module.exports = {
    name: "ttt",

    async execute(sock, msg) {
        const from = msg.key.remoteJid
        const sender = msg.key.participant || msg.key.remoteJid
        const pushName = msg.pushName || "Player"
        const text = msg.message.conversation || ""
        const args = text.split(" ").slice(1)

        // Initialize chat waiting queue
        if (!games[from]) {
            if (!waitingPlayers[from]) {
                // No one waiting ΓåÆ this player waits
                waitingPlayers[from] = { player: sender, pushName }
                return await sock.sendMessage(from, { text: formatMessage("TIC-TAC-TOE", "Waiting for an opponent... ΓÜí") })
            }

            // Someone waiting ΓåÆ start game 
            const opponent = waitingPlayers[from]
            delete waitingPlayers[from]

            games[from] = {
                players: [opponent.player, sender],
                pushNames: [opponent.pushName, pushName],
                symbols: ["Γ£û∩╕Å", "Γ¡ò"],
                turnIndex: 0,
                board: ["1∩╕ÅΓâú","2∩╕ÅΓâú","3∩╕ÅΓâú","4∩╕ÅΓâú","5∩╕ÅΓâú","6∩╕ÅΓâú","7∩╕ÅΓâú","8∩╕ÅΓâú","9∩╕ÅΓâú"]
            }

            const game = games[from]
            return await sock.sendMessage(from, { text: formatMessage("TIC-TAC-TOE",
                `Game Started!\n\n${renderBoard(game.board, game)}\n\nTurn: ${mentionPlayer(game)}` 
            )})
        }

        // Existing game ΓåÆ make a move
        const game = games[from]

        // Not this player's turn
        if (game.players[game.turnIndex] !== sender) {
            return await sock.sendMessage(from, { text: formatMessage("TIC-TAC-TOE", "ΓÅ│ Not your turn!") })
        }

        if (args.length === 0) {
            return await sock.sendMessage(from, { text: formatMessage("TIC-TAC-TOE", "Type .ttt <cell number 1-9> to play.") })
        }

        const move = args[0]
        const moveNum = parseInt(move)
        if (isNaN(moveNum) || moveNum < 1 || moveNum > 9) {
            return await sock.sendMessage(from, { text: formatMessage("TIC-TAC-TOE", "Γ¥î Invalid move! Choose a number 1-9.") })
        }
        
        const idx = moveNum - 1
        if (game.board[idx] === "Γ£û∩╕Å" || game.board[idx] === "Γ¡ò") {
            return await sock.sendMessage(from, { text: formatMessage("TIC-TAC-TOE", "Γ¥î Invalid move! Cell already taken.") })
        }

        // Make move
        game.board[idx] = game.symbols[game.turnIndex]

        // Check winner
        const winner = checkWinner(game.board)
        if (winner) {
            const boardDisplay = renderBoard(game.board, game)
            let winnerText = winner === "Draw" ? "Draw! ≡ƒñ¥" : `Winner: ${mentionPlayer(game, winner)} ≡ƒÄë`
            delete games[from]
            return await sock.sendMessage(from, { text: formatMessage("TIC-TAC-TOE", boardDisplay + `\n\n${winnerText}`) })
        }

        // Switch turn
        game.turnIndex = 1 - game.turnIndex
        await sock.sendMessage(from, { text: formatMessage("TIC-TAC-TOE", renderBoard(game.board, game) + `\n\nNext turn: ${mentionPlayer(game)}`) })
    }
}

// Render board with symbols and playersΓÇÖ names
function renderBoard(board, game) {
    return board.map((cell, i) => {
        if (cell === "Γ£û∩╕Å") return "Γ£û∩╕Å"
        if (cell === "Γ¡ò") return "Γ¡ò"
    return `[${cell}]`
    }).reduce((acc, val, i) => {
        acc += val + ((i+1)%3===0 ? "\n" : " ")
        return acc
    }, "")
}

// Mention current player
function mentionPlayer(game, symbol = null) {
    const playerIdx = symbol ? game.symbols.indexOf(symbol) : game.turnIndex
    const playerJid = game.players[playerIdx]
    // Use pushName if available, otherwise use phone number
    const displayName = game.pushNames?.[playerIdx] || (playerJid ? playerJid.split('@')[0] : "Unknown")
    const symbolToUse = symbol || game.symbols[game.turnIndex]
    return `${displayName} ${symbolToUse}`
}

// Check winner combos
function checkWinner(b) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ]
    for (let line of wins) {
        const [a,b1,c] = line
        if (b[a] === b[b1] && b[a] === b[c]) return b[a]
    }
    if (!b.some(c => "123456789".includes(c))) return "Draw"
    return null
}
