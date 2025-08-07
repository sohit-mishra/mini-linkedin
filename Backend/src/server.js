require('module-alias/register');
const express = require('express');
const cors = require('cors');
const connectDatabase = require('@/config/db');
const env = require('@/config/env');
const authRoutes = require('@/routes/authRoutes');
const postRoutes = require('@/routes/postRoutes');
const uploadRoutes = require('@/routes/uploadRoutes');

const app = express();
const PORT = env.PORT;

app.use(express.json());

app.use(cors({
    origin: env.FRONTEND_URL ,
    Credential: true
}))

connectDatabase();

app.get('/', (req, res)=>{
    res.send("Hello World");
})

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});