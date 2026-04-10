"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 4001;
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor de diagnóstico funcionando' });
});
app.listen(PORT, () => {
    console.log(`🚀 DIAGNÓSTICO: Servidor escuchando en http://localhost:${PORT}`);
});
//# sourceMappingURL=diag.js.map