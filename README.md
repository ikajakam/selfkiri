# selfkiri

- The goal of this challenge is to steal the admin’s(victim) API key
- victim will click only once on the attacker's website 
- Should work on the latest version of Chromium and FireFox.


### Prerequisites
- [Node.js](https://nodejs.org/)

For Ubuntu / Debian (via NodeSource)

```bash
# Download and run NodeSource setup script
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

```bash
# Install Node.js and npm
sudo apt install -y nodejs
```
```bash
# Verify installation
node -v
npm -v
```

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ikajakam/selfkiri.git
   cd selfkiri
   ```
2. **Install dependencies:**
   ```bash
   npm install
   npm install express
   npm install express express-session better-sqlite3 ejs
   ```
3. **Run the app:**
   ```bash
   node app.js
   ```
   ```bash
   nohup node app.js > out.log 2>&1 &
   ```

4. **Open in your browser :**
   [http://localhost:3000](http://localhost:3000)
