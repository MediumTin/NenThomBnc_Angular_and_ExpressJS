-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 23, 2026 at 09:45 PM
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
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `inventory_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `product_sku` varchar(100) NOT NULL,
  `quantity_storage` int(11) NOT NULL DEFAULT 0,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventory_id`, `warehouse_id`, `product_sku`, `quantity_storage`, `updated_at`) VALUES
(1, 2, '3 Day WKND', 194, '2025-11-30 17:38:51'),
(2, 4, 'Amber And Vanilla', 75, '2025-11-30 07:27:49'),
(3, 5, 'Coconut And Sea Salt', 130, '2025-11-30 07:27:49'),
(4, 2, 'Day Party', 131, '2025-11-30 07:27:49'),
(5, 5, 'Jasmin ylang ylang sandalwood', 183, '2025-11-30 07:27:49'),
(6, 5, 'Lavander Vanilia', 160, '2025-11-30 07:27:49'),
(7, 1, 'Milk Vanilla', 198, '2025-11-30 07:27:49'),
(8, 5, 'Sandalwood And Rose', 198, '2025-11-30 07:27:49'),
(9, 2, 'Shower Playlist', 106, '2025-11-30 07:27:49'),
(10, 5, 'Smells Like Cacao And Vanilla', 100, '2025-11-30 07:27:49'),
(11, 1, 'Sunset Disco', 126, '2025-11-30 07:27:49'),
(12, 1, 'Warn Cider And Cinamon', 72, '2025-11-30 07:27:49'),
(13, 5, 'Lumos Honeydrew And Coconut', 55, '2025-11-30 07:27:49'),
(14, 3, 'Lumos Tropical Orchard', 113, '2025-11-30 07:27:49'),
(15, 3, 'Lumos Rose Boutique', 111, '2025-11-30 07:27:49'),
(16, 4, 'Lumos Lemongrass', 69, '2025-11-30 07:27:49'),
(17, 2, 'Lumos Cajeput', 58, '2025-11-30 07:27:49'),
(18, 4, 'Lumos menthol', 120, '2025-11-30 07:27:49'),
(19, 1, 'Lumos cold', 127, '2025-11-30 07:27:49'),
(20, 5, 'Lumos And Cucumber', 56, '2025-11-30 07:27:49'),
(21, 1, 'Lumos Juicy Peach', 157, '2025-11-30 07:27:49'),
(22, 4, 'Lumos Midnight sandalwood', 136, '2025-11-30 07:27:49'),
(23, 5, 'YOU ARE THE MAGIC', 50, '2025-11-30 07:27:49'),
(24, 1, 'BLOW A WISH', 164, '2025-11-30 07:27:49'),
(25, 2, 'Candle Tray', 137, '2025-11-30 07:27:49'),
(26, 2, 'Candle Snuffer', 182, '2025-11-30 07:27:49'),
(27, 2, 'Candle Scissor', 137, '2025-11-30 07:27:49'),
(28, 4, 'Candle matchbox', 50, '2025-11-30 07:27:49'),
(29, 5, 'Candle rotation tray', 95, '2025-11-30 07:27:49'),
(30, 3, 'Candle pinwheel', 54, '2025-11-30 07:27:49'),
(31, 4, 'Candle metal tray', 77, '2025-11-30 07:27:49'),
(32, 3, 'Candle holder', 74, '2025-11-30 07:27:49'),
(33, 3, 'Wood tray', 102, '2025-11-30 07:27:49'),
(34, 1, 'Nen_and_Hoa', 143, '2025-11-30 07:27:49'),
(35, 4, 'Dalat Gift', 62, '2025-11-30 07:27:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD KEY `fk_inventory_warehouse` (`warehouse_id`),
  ADD KEY `idx_inventory_sku` (`product_sku`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `fk_inventory_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `ware_houses` (`warehouse_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
