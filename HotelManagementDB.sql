-- Create Database
CREATE DATABASE HotelManagementDB;

-- Use the created database
USE HotelManagementDB;

-- Create Customers Table
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15),
    email VARCHAR(100)
);

-- Create Rooms Table
CREATE TABLE Rooms (
    room_id INT PRIMARY KEY,
    room_type VARCHAR(50),
    capacity INT,
    price_per_night DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'Available'
);

-- Create Bookings Table
CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY,
    customer_id INT,
    room_id INT,
    booking_date DATE,
    number_of_guests INT,
    total_cost DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (room_id) REFERENCES Rooms(room_id)
);

-- Create Services Table
CREATE TABLE Services (
    service_id INT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    service_price DECIMAL(10, 2) NOT NULL
);

-- Create ServiceLogs Table
CREATE TABLE ServiceLogs (
    log_id INT PRIMARY KEY,
    booking_id INT,
    service_id INT,
    service_date DATE NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id),
    FOREIGN KEY (service_id) REFERENCES Services(service_id)
);

-- Insert Data into Customers
INSERT INTO Customers (customer_id, customer_name, contact_number, email) VALUES
(1, 'John Smith', '123-456-7890', 'john.smith@example.com'),
(2, 'Jane Doe', '987-654-3210', 'jane.doe@example.com'),
(3, 'Alice Brown', '555-123-4567', 'alice.brown@example.com'),
(4, 'Bob Johnson', '444-987-6543', 'bob.johnson@example.com'),
(5, 'Emily Davis', '333-222-1111', 'emily.davis@example.com');

-- Insert Data into Rooms
INSERT INTO Rooms (room_id, room_type, capacity, price_per_night, status) VALUES
(101, 'Single', 1, 100.00, 'Available'),
(102, 'Double', 2, 150.00, 'Available'),
(103, 'Suite', 4, 300.00, 'Occupied'),
(104, 'Deluxe', 2, 200.00, 'Available'),
(105, 'Family', 5, 250.00, 'Available');

-- Insert Data into Bookings
INSERT INTO Bookings (booking_id, customer_id, room_id, booking_date, number_of_guests, total_cost) VALUES
(1001, 1, 101, '2024-12-01', 1, 100.00),
(1002, 2, 102, '2024-12-02', 2, 300.00),
(1003, 3, 103, '2024-12-03', 4, 1200.00),
(1004, 4, 104, '2024-12-04', 2, 400.00),
(1005, 5, 105, '2024-12-05', 5, 1250.00);

-- Insert Data into Services
INSERT INTO Services (service_id, service_name, service_price) VALUES
(1, 'Spa Treatment', 100.00),
(2, 'Room Service', 50.00),
(3, 'Airport Pickup', 75.00),
(4, 'Laundry', 25.00),
(5, 'Gym Access', 20.00);

-- Insert Data into ServiceLogs
INSERT INTO ServiceLogs (log_id, booking_id, service_id, service_date) VALUES
(1, 1001, 1, '2024-12-01'), -- John Smith used Spa Treatment on booking date
(2, 1002, 2, '2024-12-02'), -- Jane Doe used Room Service
(3, 1003, 3, '2024-12-03'), -- Alice Brown used Airport Pickup
(4, 1004, 4, '2024-12-04'), -- Bob Johnson used Laundry
(5, 1005, 5, '2024-12-05'); -- Emily Davis used Gym Access

-- Insert Additional Bookings
INSERT INTO Bookings (booking_id, customer_id, room_id, booking_date, number_of_guests, total_cost) VALUES
(1006, 1, 102, '2024-12-06', 2, 300.00), -- John Smith books a Double Room
(1007, 2, 103, '2024-12-07', 4, 1200.00), -- Jane Doe books a Suite
(1008, 3, 101, '2024-12-08', 1, 100.00), -- Alice Brown books a Single Room
(1009, 4, 105, '2024-12-09', 5, 1250.00), -- Bob Johnson books a Family Room
(1010, 5, 104, '2024-12-10', 2, 400.00), -- Emily Davis books a Deluxe Room
(1011, 1, 103, '2024-12-11', 4, 1200.00), -- John Smith books a Suite again
(1012, 2, 105, '2024-12-12', 5, 1250.00), -- Jane Doe books a Family Room
(1013, 3, 104, '2024-12-13', 2, 400.00), -- Alice Brown books a Deluxe Room
(1014, 4, 102, '2024-12-14', 2, 300.00), -- Bob Johnson books a Double Room
(1015, 5, 101, '2024-12-15', 1, 100.00); -- Emily Davis books a Single Room

-- Insert Additional Service Requests
INSERT INTO ServiceLogs (log_id, booking_id, service_id, service_date) VALUES
(6, 1006, 2, '2024-12-06'), -- John Smith used Room Service during his booking
(7, 1007, 1, '2024-12-07'), -- Jane Doe used Spa Treatment during her booking
(8, 1008, 3, '2024-12-08'), -- Alice Brown used Airport Pickup during her booking
(9, 1009, 4, '2024-12-09'), -- Bob Johnson used Laundry during his booking
(10, 1010, 5, '2024-12-10'), -- Emily Davis used Gym Access during her booking
(11, 1011, 1, '2024-12-11'), -- John Smith used Spa Treatment again
(12, 1012, 2, '2024-12-12'), -- Jane Doe used Room Service
(13, 1013, 3, '2024-12-13'), -- Alice Brown used Airport Pickup
(14, 1014, 4, '2024-12-14'), -- Bob Johnson used Laundry
(15, 1015, 5, '2024-12-15'), -- Emily Davis used Gym Access again
(16, 1006, 4, '2024-12-06'), -- John Smith used Laundry
(17, 1007, 5, '2024-12-07'), -- Jane Doe used Gym Access
(18, 1008, 2, '2024-12-08'), -- Alice Brown used Room Service
(19, 1009, 1, '2024-12-09'), -- Bob Johnson used Spa Treatment
(20, 1010, 3, '2024-12-10'); -- Emily Davis used Airport Pickup
