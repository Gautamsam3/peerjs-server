const fs = require('fs')
const { PeerServer } = require('peer')
require('dotenv').config()

// Environment variables
const PEER_PORT = process.env.PEER_PORT
const NODE_ENV = process.env.NODE_ENV
const PEER_HOST = process.env.PEER_HOST
const TURN_USERNAME = process.env.TURN_USERNAME
const TURN_PASSWORD = process.env.TURN_PASSWORD

const TURN_SERVERS = process.env.TURN_SERVER_URL
  ? process.env.TURN_SERVER_URL.split(',').map(url => ({
      urls: `turn:${url.trim()}`,
      username: TURN_USERNAME,
      credential: TURN_PASSWORD
    }))
  : []

// Determine if we're in production
const isProduction = NODE_ENV === 'production'



// Create PeerServer
const peerServer = PeerServer({
  port: PEER_PORT,
  path: '/',
  host: '0.0.0.0',
  ssl: isProduction ? undefined : {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem')
  },
  proxied: isProduction,
  debug: true,
  config: {

    iceServers: [
      // STUN servers - help with NAT traversal
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun.ekiga.net' },
      { urls: 'stun:stun.ideasip.com' },
      { urls: 'stun:stun.schlund.de' },
      { urls: 'stun:stun.stunprotocol.org:3478' },
      { urls: 'stun:stun.voiparound.com' },
      { urls: 'stun:stun.voipbuster.com' },

      ...TURN_SERVERS

    ],
    iceTransportPolicy: 'relay',
    sdpSemantics: 'unified-plan',
    iceCandidatePoolSize: 10,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
    tcpMux: true
  }
})

peerServer.on('connection', (client) => {
  console.log('PeerJS client connected:', client.getId())
})

peerServer.on('disconnect', (client) => {
  console.log('PeerJS client disconnected:', client.getId())
})

console.log(`PeerServer running on port ${PEER_PORT} with ${isProduction ? 'HTTP' : 'HTTPS'}`)
console.log('To connect from another device, use the following URL:')

console.log(`${PEER_HOST}:${PEER_PORT}`)
