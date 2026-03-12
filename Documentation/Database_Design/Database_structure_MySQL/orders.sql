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
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(12,2) NOT NULL,
  `status_order` enum('pending','processing','shipped','completed','cancelled') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `order_date`, `total_amount`, `status_order`) VALUES
(1, 1, '2025-11-07 01:31:36', 350000.00, 'shipped'),
(2, 2, '2025-11-07 01:31:36', 150000.00, 'pending'),
(3, 1, '2025-11-07 01:31:36', 890000.00, 'shipped'),
(5, 2, '2025-11-07 01:31:36', 100000.00, 'cancelled'),
(9, 1, '2025-12-01 00:09:50', 1896.00, 'processing'),
(10, 1, '2025-12-01 00:27:03', 612.00, 'pending'),
(11, 4, '2025-12-01 00:42:30', 678.00, 'processing'),
(12, 1, '2025-12-01 00:58:08', 1872.00, 'processing'),
(13, 1, '2025-12-01 01:00:33', 918.00, 'processing'),
(14, 1, '2025-12-01 15:17:08', 2412.00, 'processing'),
(15, 1, '2025-12-13 13:14:50', 930.00, 'processing'),
(16, 1, '2025-12-13 13:17:01', 3294.00, 'processing'),
(17, 1, '2025-12-14 10:08:42', 1494.00, 'processing'),
(18, 1, '2025-12-14 16:29:14', 1494.00, 'processing'),
(19, 1, '2025-12-14 16:32:09', 57.23, 'processing'),
(20, 1, '2025-12-14 16:33:34', 35.34, 'processing'),
(21, 1, '2025-12-14 17:26:21', 930.00, 'processing'),
(22, 1, '2025-12-14 17:27:03', 35.34, 'processing'),
(23, 1, '2025-12-14 17:30:09', 35.34, 'processing'),
(24, 1, '2025-12-14 18:10:44', 57.23, 'processing'),
(25, 1, '2025-12-14 18:12:00', 70.22, 'processing'),
(26, 1, '2025-12-14 18:18:12', 39.44, 'processing'),
(27, 1, '2025-12-14 21:47:57', 35.34, 'processing'),
(28, 1, '2025-12-14 21:50:28', 56.77, 'processing'),
(29, 1, '2025-12-14 21:53:28', 56.77, 'processing'),
(30, 1, '2025-12-14 21:55:05', 35.34, 'processing'),
(31, 1, '2025-12-14 21:59:51', 35.34, 'processing'),
(32, 1, '2025-12-16 22:17:34', 92.11, 'processing'),
(33, 1, '2025-12-16 22:27:58', 22.34, 'processing'),
(34, 1, '2025-12-16 22:29:47', 57.23, 'processing'),
(35, 1, '2025-12-16 22:32:08', 68.86, 'processing'),
(36, 1, '2025-12-16 22:35:11', 35.34, 'processing'),
(37, 1, '2025-12-16 23:06:29', 57.23, 'processing'),
(38, 1, '2025-12-16 23:08:11', 35.34, 'processing'),
(39, 1, '2025-12-16 23:09:13', 930.00, 'processing'),
(40, 1, '2025-12-16 23:11:01', 48.19, 'processing'),
(41, 4, '2025-12-16 23:54:20', 103.94, 'processing'),
(42, 1, '2025-12-17 00:04:46', 57.47, 'processing'),
(43, 1, '2025-12-17 00:06:39', 35.48, 'processing'),
(44, 1, '2025-12-17 00:12:54', 35.48, 'processing'),
(45, 1, '2025-12-17 08:03:05', 57.42, 'processing'),
(46, 1, '2025-12-17 15:57:19', 92.42, 'processing'),
(47, 1, '2025-12-20 12:58:23', 35.44, 'processing'),
(48, 1, '2025-12-20 13:01:40', 104.04, 'processing'),
(49, 1, '2025-12-23 09:19:44', 930.00, 'processing'),
(50, 1, '2025-12-23 09:20:41', 2424.00, 'processing'),
(51, 4, '2025-12-25 01:57:22', 678.00, 'processing'),
(52, 4, '2025-12-25 23:59:41', 678.00, 'processing'),
(53, 1, '2025-12-26 00:04:25', 930.00, 'processing'),
(54, 1, '2025-12-28 12:10:58', 930.00, 'processing'),
(55, 1, '2025-12-28 12:12:14', 35.48, 'processing'),
(56, 1, '2025-12-28 14:31:35', 930.00, 'processing'),
(57, 1, '2025-12-28 16:37:25', 1506.00, 'processing'),
(58, 1, '2025-12-28 16:43:52', 1506.00, 'processing'),
(59, 1, '2025-12-28 16:46:02', 2718.00, 'processing'),
(60, 1, '2025-12-28 18:13:23', 930.00, 'processing'),
(61, 1, '2025-12-28 18:13:24', 930.00, 'processing'),
(62, 1, '2025-12-28 18:13:26', 930.00, 'processing'),
(63, 1, '2025-12-28 18:13:27', 930.00, 'processing'),
(64, 1, '2025-12-28 18:13:29', 930.00, 'processing'),
(65, 1, '2025-12-28 18:13:32', 930.00, 'processing'),
(66, 1, '2025-12-28 18:14:11', 930.00, 'processing'),
(67, 1, '2025-12-28 18:14:12', 930.00, 'processing'),
(68, 1, '2025-12-28 18:14:17', 930.00, 'processing'),
(69, 1, '2025-12-28 18:14:19', 930.00, 'processing'),
(70, 1, '2025-12-28 18:14:49', 930.00, 'processing'),
(71, 1, '2025-12-28 18:14:50', 930.00, 'processing'),
(72, 1, '2025-12-28 18:14:53', 930.00, 'processing'),
(73, 1, '2025-12-28 18:14:56', 930.00, 'processing'),
(74, 1, '2025-12-28 18:18:37', 930.00, 'processing'),
(75, 1, '2025-12-28 18:18:38', 930.00, 'processing'),
(76, 1, '2025-12-28 18:23:45', 4590.00, 'processing'),
(77, 1, '2025-12-28 19:19:55', 35.48, 'processing'),
(78, 1, '2025-12-28 19:36:39', 35.48, 'processing'),
(79, 4, '2025-12-28 20:15:51', 25.87, 'processing'),
(80, 4, '2025-12-28 20:16:50', 3198.00, 'completed'),
(81, 1, '2025-12-28 20:19:46', 930.00, 'processing'),
(82, 1, '2025-12-28 20:20:34', 57.47, 'processing'),
(83, 1, '2025-12-28 20:21:40', 2424.00, 'processing'),
(84, 1, '2026-01-06 06:55:05', 1506.00, 'processing'),
(85, 1, '2026-01-06 06:56:26', 930.00, 'processing'),
(86, 1, '2026-01-15 08:24:08', 930.00, 'processing'),
(87, 1, '2026-01-15 08:50:20', 126.19, 'processing'),
(88, 1, '2026-01-17 15:35:02', 1494.00, 'completed'),
(89, 1, '2026-01-17 20:44:40', 35.46, 'processing'),
(90, 1, '2026-01-18 16:43:05', 35.50, 'processing'),
(91, 1, '2026-01-18 16:56:02', 35.50, 'processing'),
(92, 1, '2026-01-18 16:59:31', 35.50, 'processing'),
(93, 1, '2026-01-25 19:46:41', 930.00, 'processing'),
(94, 1, '2026-01-25 19:54:02', 930.00, 'processing'),
(95, 1, '2026-01-25 20:23:03', 930.00, 'processing');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_orders_customer` (`customer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
