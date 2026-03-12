-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 23, 2026 at 09:46 PM
-- Server version: 10.6.18-MariaDB-cll-lve-log
-- PHP Version: 8.4.17

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
(12, 14, 'cash', 'Undefine by Cash', 'success', '2025-12-01 15:17:08'),
(13, 15, 'cash', 'Undefine by Cash', 'success', '2025-12-13 13:14:50'),
(14, 16, 'cash', 'Undefine by Cash', 'success', '2025-12-13 13:17:01'),
(15, 17, 'cash', 'Undefine by Cash', 'success', '2025-12-14 10:08:42'),
(16, 18, 'cash', 'Undefine by Cash', 'success', '2025-12-14 16:29:14'),
(17, 19, 'cash', 'Undefine by Cash', 'success', '2025-12-14 16:32:09'),
(18, 20, 'cash', 'Undefine by Cash', 'success', '2025-12-14 16:33:34'),
(19, 21, 'cash', 'Undefine by Cash', 'success', '2025-12-14 17:26:21'),
(20, 22, 'cash', 'Undefine by Cash', 'success', '2025-12-14 17:27:03'),
(21, 23, 'cash', 'Undefine by Cash', 'success', '2025-12-14 17:30:10'),
(22, 24, 'cash', 'Undefine by Cash', 'success', '2025-12-14 18:10:44'),
(23, 25, 'cash', 'Undefine by Cash', 'success', '2025-12-14 18:12:00'),
(24, 26, 'cash', 'Undefine by Cash', 'success', '2025-12-14 18:18:12'),
(25, 27, 'cash', 'Undefine by Cash', 'success', '2025-12-14 21:47:57'),
(26, 28, 'cash', 'Undefine by Cash', 'success', '2025-12-14 21:50:28'),
(27, 29, 'cash', 'Undefine by Cash', 'success', '2025-12-14 21:53:28'),
(28, 30, 'cash', 'Undefine by Cash', 'success', '2025-12-14 21:55:05'),
(29, 31, 'cash', 'Undefine by Cash', 'success', '2025-12-14 21:59:51'),
(30, 32, 'cash', 'Undefine by Cash', 'success', '2025-12-16 22:17:34'),
(31, 33, 'cash', 'Undefine by Cash', 'success', '2025-12-16 22:27:58'),
(32, 34, 'cash', 'Undefine by Cash', 'success', '2025-12-16 22:29:47'),
(33, 35, 'cash', 'Undefine by Cash', 'success', '2025-12-16 22:32:08'),
(34, 36, 'cash', 'Undefine by Cash', 'success', '2025-12-16 22:35:11'),
(35, 37, 'cash', 'Undefine by Cash', 'success', '2025-12-16 23:06:29'),
(36, 38, 'cash', 'Undefine by Cash', 'success', '2025-12-16 23:08:11'),
(37, 39, 'cash', 'Undefine by Cash', 'success', '2025-12-16 23:09:13'),
(38, 40, 'cash', 'Undefine by Cash', 'success', '2025-12-16 23:11:01'),
(39, 41, 'cash', 'Undefine by Cash', 'success', '2025-12-16 23:54:20'),
(40, 42, 'cash', 'Undefine by Cash', 'success', '2025-12-17 00:04:46'),
(41, 43, 'cash', 'Undefine by Cash', 'success', '2025-12-17 00:06:39'),
(42, 44, 'cash', 'Undefine by Cash', 'success', '2025-12-17 00:12:54'),
(43, 45, 'cash', 'Undefine by Cash', 'success', '2025-12-17 08:03:05'),
(44, 46, 'cash', 'Undefine by Cash', 'success', '2025-12-17 15:57:19'),
(45, 47, 'cash', 'Undefine by Cash', 'success', '2025-12-20 12:58:23'),
(46, 48, 'cash', 'Undefine by Cash', 'success', '2025-12-20 13:01:40'),
(47, 49, 'cash', 'Undefine by Cash', 'success', '2025-12-23 09:19:44'),
(48, 50, 'cash', 'Undefine by Cash', 'success', '2025-12-23 09:20:41'),
(49, 51, 'cash', 'Undefine by Cash', 'success', '2025-12-25 01:57:22'),
(50, 52, 'cash', 'Undefine by Cash', 'success', '2025-12-25 23:59:41'),
(51, 53, 'cash', 'Undefine by Cash', 'success', '2025-12-26 00:04:25'),
(52, 54, 'cash', 'Undefine by Cash', 'success', '2025-12-28 12:10:58'),
(53, 55, 'cash', 'Undefine by Cash', 'success', '2025-12-28 12:12:14'),
(54, 56, 'cash', 'Undefine by Cash', 'success', '2025-12-28 14:31:35'),
(55, 57, 'cash', 'Undefine by Cash', 'success', '2025-12-28 16:37:25'),
(56, 58, 'cash', 'Undefine by Cash', 'success', '2025-12-28 16:43:52'),
(57, 59, 'cash', 'Undefine by Cash', 'success', '2025-12-28 16:46:02'),
(58, 60, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:23'),
(59, 61, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:24'),
(60, 62, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:26'),
(61, 63, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:27'),
(62, 64, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:29'),
(63, 65, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:32'),
(64, 66, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:11'),
(65, 67, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:12'),
(66, 68, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:17'),
(67, 69, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:19'),
(68, 70, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:49'),
(69, 71, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:50'),
(70, 72, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:53'),
(71, 73, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:56'),
(72, 74, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:18:37'),
(73, 75, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:18:38'),
(74, 76, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:23:45'),
(75, 77, 'cash', 'Undefine by Cash', 'success', '2025-12-28 19:19:55'),
(76, 78, 'paypal', '6UD11051JE873780N', 'success', '2025-12-28 19:36:39'),
(77, 79, 'paypal', '428323611R377405B', 'success', '2025-12-28 20:15:51'),
(78, 80, 'cash', 'Undefine by Cash', 'success', '2025-12-28 20:16:50'),
(79, 81, 'cash', 'Undefine by Cash', 'success', '2025-12-28 20:19:46'),
(80, 82, 'paypal', '2ES06100XA0939833', 'success', '2025-12-28 20:20:34'),
(81, 83, 'vnpay', '28202103', 'success', '2025-12-28 20:21:40'),
(82, 84, 'cash', 'Undefine by Cash', 'success', '2026-01-06 06:55:05'),
(83, 85, 'cash', 'Undefine by Cash', 'success', '2026-01-06 06:56:26'),
(84, 86, 'cash', 'Undefine by Cash', 'pending', '2026-01-15 08:24:08'),
(85, 87, 'paypal', '51W72818AG839343J', 'pending', '2026-01-15 08:50:20'),
(86, 88, 'cash', 'Undefine by Cash', 'pending', '2026-01-17 15:35:02'),
(87, 89, 'paypal', '9JD69701WX538660N', 'pending', '2026-01-17 20:44:40'),
(88, 90, 'paypal', '1CS20671NL340402F', 'pending', '2026-01-18 16:43:05'),
(89, 91, 'paypal', '6MD83973Y0407434M', 'pending', '2026-01-18 16:56:02'),
(90, 92, 'paypal', '0R9228755V178211T', 'pending', '2026-01-18 16:59:31'),
(91, 93, 'vnpay', '25195017', 'pending', '2026-01-25 19:46:41'),
(92, 94, 'vnpay', '25195314', 'pending', '2026-01-25 19:54:02'),
(93, 95, 'vnpay', '25202215', 'pending', '2026-01-25 20:23:03');

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
