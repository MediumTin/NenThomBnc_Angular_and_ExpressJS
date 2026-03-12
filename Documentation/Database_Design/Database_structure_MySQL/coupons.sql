-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 23, 2026 at 09:44 PM
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
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `coupon_id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percent','amount') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_value` decimal(10,2) DEFAULT NULL,
  `max_discount_value` decimal(10,2) DEFAULT NULL,
  `valid_from` datetime NOT NULL,
  `valid_to` datetime NOT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `per_user_limit` int(11) DEFAULT NULL,
  `status` enum('active','expired','disabled') DEFAULT 'active',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`coupon_id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `max_discount_value`, `valid_from`, `valid_to`, `usage_limit`, `per_user_limit`, `status`, `created_at`, `updated_at`) VALUES
(1, 'NEWYEAR2025', 'percent', 15.00, 200000.00, 50000.00, '2025-12-20 00:00:00', '2026-01-05 00:00:00', 500, 2, 'active', '2025-11-07 01:30:48', '2026-01-25 09:07:20'),
(2, 'FREESHIP50', 'amount', 50000.00, 100000.00, NULL, '2025-11-01 00:00:00', '2025-12-31 00:00:00', 1000, 3, 'active', '2025-11-07 01:30:48', '2026-01-25 09:07:42'),
(3, 'WELCOME10', 'percent', 10.00, 0.00, NULL, '2025-01-01 00:00:00', '2025-12-31 00:00:00', 10000, 1, 'disabled', '2025-11-07 01:30:48', '2026-01-16 07:35:36'),
(4, 'VIPMEMBER', 'amount', 100000.00, 500000.00, NULL, '2025-05-01 00:00:00', '2026-05-01 00:00:00', 100, 5, 'active', '2025-11-07 01:30:48', '2025-11-07 01:30:48'),
(5, 'SUMMERSALE', 'percent', 20.00, 300000.00, 80000.00, '2025-06-01 00:00:00', '2025-08-31 00:00:00', 2000, 2, 'active', '2025-11-07 01:30:48', '2026-01-16 07:35:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`coupon_id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
