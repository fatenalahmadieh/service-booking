// POST   /api/flights
// GET    /api/flights
// GET    /api/flights/:id
// PUT    /api/flights/:id
// DELETE /api/flights/:id

const flightSchema = require('../models/flightSchema');
const Flight = require('../models/flightSchema');

// POST   /api/flights 
// Create flights
exports.createFlight = async (req, res) => {
    try{
        const flight = await Flight.findOne({$or: [
            {flightNumber: req.body["flightNumber"]},
            {airline: req.body["airline"]},
            {departureAirport: req.body["departureAirport"]},
            {arrivalAirport: req.body["arrivalAirport"]},
            {departureTime: req.body["departureTime"]},
            {arrivalTime: req.body["arrivalTime"]},
            {price: req.body["price"]},
            {availableSeats: req.body["availableSeats"]},
            {"airport.name": req.body["airport.name"]},
            {"airport.code": req.body["airport.code"]},
            {"airport.city": req.body["airport.city"]},
            {"airport.country": req.body["airport.country"]},
            {status: req.body["status"]}
        ]});
        if(!flight){
            return res
            .status(401)
            .json({message: "flight is not found"});
        };
        const newFlight = await flightSchema.create({
            flightNumber: req.body["flightNumber"],
            airline: req.body["airline"],
            departureAirport: req.body["departureAirport"],
            arrivalAirport: req.body["arrivalAirport"],
            departureTime: req.body["departureTime"],
            arrivalTime: req.body["arrivalTime"],
            price: req.body["price"],
            availableSeats: req.body["availableSeats"],
            "airport.name": req.body["airport.name"],
            "airport.code": req.body["airport.code"],
            "airport.city": req.body["airport.city"],
            "airport.country": req.body["airport.country"],
            status: req.body["status"]
        });
        return res.status(201).json({ data: newFlight,  message: "Flight created successfully" });
    }catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

// GET    /api/flights
// get all flights
exports.getAllFlight = async (req, res) => {
    try{
        const flights = await flight.find({});
        return res.status(200).json({ results: flights.length, data: flight });
    }catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

// GET    /api/flights/:id
// get flight by id
exports.getFlightById = async (req, res) => {
    try{
        const flight = await flight.findById(req.params["flightId"]);
        if(!flight){
            return res
            .status(401)
            .json({message: "flight is not found"});
        }
        return res.status(200).json({ data: flight });
    }catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

// PUT    /api/flights/:id
// update flight
exports.updateFlightById = async (req, res) => {
    try{
        const flight = await flight.findById(req.params["flightId"]);
        if(!flight){
            return res
            .status(401)
            .json({message : "flight is not found"});
        }
        const flight = await flight.findOneAndUpdate(
            {flightNumber: req.body["flightNumber"]},
            {airline: req.body["airline"]},
            {departureAirport: req.body["departureAirport"]},
            {arrivalAirport: req.body["arrivalAirport"]},
            {departureTime: req.body["departureTime"]},
            {arrivalTime: req.body["arrivalTime"]},
            {price: req.body["price"]},
            {availableSeats: req.body["availableSeats"]},
            {"airport.name": req.body["airport.name"]},
            {"airport.code": req.body["airport.code"]},
            {"airport.city": req.body["airport.city"]},
            {"airport.country": req.body["airport.country"]},
            {status: req.body["status"]}
        );
        return res.status(200).json({ data: flight });
    }catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

// DELETE /api/flights/:id
// delete flight
exports.deleteFlight = async (req, res) => {
    try{
        const flight = await flight.findById(req.params["flightId"]);
        if(!flight){
            return res
            .status(401)
            .json({message: "flight is not found"});
        };
        const flight = await Flight.findByIdAndDelete(req.params["flightId"]);
        return res.status(204).send();
    }catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};
