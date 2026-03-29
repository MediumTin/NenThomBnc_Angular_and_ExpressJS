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
-- Table structure for table `order_details_inventory`
--

CREATE TABLE `order_details_inventory` (
  `order_detail_id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details_inventory`
--

INSERT INTO `order_details_inventory` (`order_detail_id`, `inventory_id`) VALUES
(1, 190),
(2, 173),
(3, 192),
(4, 163),
(5, 134),
(6, 254),
(7, 239),
(8, 155),
(9, 127),
(10, 245),
(11, 212),
(12, 224),
(13, 204),
(14, 245),
(15, 158),
(16, 128),
(17, 239),
(18, 182),
(19, 262),
(20, 138);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `order_details_inventory`
--
ALTER TABLE `order_details_inventory`
  ADD PRIMARY KEY (`order_detail_id`,`inventory_id`),
  ADD KEY `inventory_id` (`inventory_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_details_inventory`
--
ALTER TABLE `order_details_inventory`
  ADD CONSTRAINT `order_details_inventory_ibfk_1` FOREIGN KEY (`order_detail_id`) REFERENCES `order_details` (`order_detail_id`),
  ADD CONSTRAINT `order_details_inventory_ibfk_2` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
