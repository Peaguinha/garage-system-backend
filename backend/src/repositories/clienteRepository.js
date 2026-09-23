const Cliente = require('../models/Cliente');

class ClienteRepository {
    async create(data) {
        return Cliente.create(data);
    }

    async findAll() {
        return Cliente.find().sort({ createdAt: -1 });
    }

    async findById(id) {
        return Cliente.findById(id);
    }

    async findByCpf(cpf) {
        return Cliente.findOne({ cpf });
    }

    async update(id, data) {
        return Cliente.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id) {
        return Cliente.findByIdAndDelete(id);
    }
}

module.exports = new ClienteRepository();