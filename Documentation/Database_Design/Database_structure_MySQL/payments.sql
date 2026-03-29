-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 20, 2026 at 12:19 AM
-- Server version: 10.6.18-MariaDB-cll-lve-log
-- PHP Version: 8.4.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wccvkyut_wp873`
--

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `method` enum('cash','paypal','vnpay','momo') NOT NULL,
  `payment_gateway_id` varchar(255) DEFAULT NULL,
  `status_payment` enum('pending','success','failed','refund') DEFAULT 'pending',
  `payment_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `order_id`, `method`, `payment_gateway_id`, `status_payment`, `payment_date`) VALUES
(1, 1, 'cash', 'Undefine by Cash', 'success', '2025-11-07 01:35:39'),
(2, 2, 'cash', 'Undefine by Cash', 'success', '2025-11-07 01:35:39'),
(3, 3, 'cash', 'Undefine by Cash', 'success', '2025-11-07 01:35:39'),
(5, 5, 'cash', 'Undefine by Cash', 'success', '2025-11-07 01:35:39'),
(7, 9, 'cash', 'Undefine by Cash', 'success', '2025-12-01 00:09:50'),
(8, 10, 'cash', 'Undefine by Cash', 'success', '2025-12-01 00:27:03'),
(9, 11, 'cash', 'Undefine by Cash', 'success', '2025-12-01 00:42:30'),
(10, 12, 'cash', 'Undefine by Cash', 'success', '2025-12-01 00:58:08'),
(11, 13, 'cash', 'Undefine by Cash', 'success', '2025-12-01 01:00:33'),
(12, 14, 'cash', 'Undefine by Cash', 'success', '2025-12-01 15:17:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `uq_payments_order` (`order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
