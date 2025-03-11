# PeerJS Server

This is a standalone PeerJS server for WebRTC signaling, separated from the main application.

## Deployment to Render

### Option 1: Using Blueprint (Recommended)

1. Push this directory to a Git repository
2. In Render dashboard, create a new Blueprint
3. Connect to your repository
4. Render will automatically configure the service based on render.yaml
5. After deployment, note the URL of your PeerJS server (e.g., https://peerjs-server.onrender.com)

### Option 2: Manual Deployment

1. In Render dashboard, create a new Web Service
2. Connect to your repository
3. Configure the service:
   - Name: peerjs-server
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start
4. Add environment variables:
   - NODE_ENV: production
   - PEER_PORT: 10000 (or your preferred port)
   - HOST: (leave blank, Render will set this automatically)
5. Click "Create Web Service"

## After Deployment

After deploying the PeerJS server, update your main application's client-side code to point to the new server:

```javascript
const myPeer = new Peer(storedPeerId, {
  host: 'your-peerjs-server.onrender.com', // Replace with your PeerJS server URL
  port: '443', // Use 443 for HTTPS
  path: '/', // Root path for dedicated PeerJS server
  secure: true,
  // ... rest of your configuration
});
```

## Local Development

To run this server locally:

```bash
npm install
node peerServer.js
```

The server will be available at https://localhost:3002 (or the port specified in your environment variables).
