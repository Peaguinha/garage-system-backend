const mongoose = require('mongoose');

async function connectDatabase() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/garage-system';

    try {
        await mongoose.connect(uri);
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        throw error;
    }
}

module.exports = connectDatabase;