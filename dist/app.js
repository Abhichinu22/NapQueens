"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const Event_1 = __importDefault(require("./routes/Event"));
const booking_1 = __importDefault(require("./routes/booking"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(body_parser_1.default.json());
app.use('/events', Event_1.default);
app.use('/bookings', booking_1.default);
mongoose_1.default.connect('mongodb://localhost:27017/event-booking-system')
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(err => {
    console.error('Database connection error', err);
});
exports.default = app;
