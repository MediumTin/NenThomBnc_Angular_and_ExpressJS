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
-- Table structure for table `personal_shopping_bag`
--

CREATE TABLE `personal_shopping_bag` (
  `bag_item_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `candle_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price_unit` decimal(10,2) DEFAULT NULL,
  `candle_image` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_shopping_bag`
--

INSERT INTO `personal_shopping_bag` (`bag_item_id`, `customer_id`, `candle_name`, `quantity`, `price_unit`, `candle_image`) VALUES
(1, 1, 'Candle matchbox', 1, 10.00, '../../../../assets/img/Automation/Image/28.jpg'),
(2, 1, 'Candle Snuffer', 9, 85.00, '../../../../assets/img/Automation/Image/26.jpg'),
(3, 1, 'Lumos Honeydrew And Coconut', 1, 480.00, '../../../../assets/img/Automation/Image/13.jpg'),
(4, 3, 'BLOW A WISH', 10, 315.00, '../../../../assets/img/Automation/Image/24.jpg'),
(5, 3, 'Warn Cider And Cinamon', 4, 450.00, '../../../../assets/img/Automation/Image/12.jpg'),
(6, 4, 'Rose Garden Candle', 2, 18.20, 'images/candles/rose_garden.jpg'),
(7, 5, 'Jasmine Night Candle', 1, 13.90, 'images/candles/jasmine_night.jpg'),
(8, 5, 'Coffee Aroma Candle', 2, 11.50, 'images/candles/coffee_aroma.jpg'),
(9, 1, 'Candle Snuffer', 9, 85.00, '../../../../assets/img/Automation/Image/26.jpg'),
(10, 1, '3 Day WKND', 5, 300.00, '../../../../assets/img/Automation/Image/1.jpg'),
(14, 2, 'Candle Scissor', 7, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(15, 2, '3 Day WKND', 5, 300.00, '../../../../assets/img/Automation/Image/1.jpg'),
(16, 2, 'Candle matchbox', 8, 10.00, '../../../../assets/img/Automation/Image/28.jpg'),
(17, 2, 'Lumos Rose Boutique', 1, 480.00, '../../../../assets/img/Automation/Image/15.jpg'),
(18, 2, 'Lumos Lemongrass', 1, 255.00, '../../../../assets/img/Automation/Image/16.jpg'),
(21, 1, 'Lavender Breeze Candle2', 2, 12.99, 'images/candles/lavender_breeze.jpg'),
(22, 1, 'Candle matchbox', 1, 10.00, '../../../../assets/img/Automation/Image/28.jpg'),
(23, 1, 'Candle matchbox', 1, 10.00, '../../../../assets/img/Automation/Image/28.jpg'),
(24, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(25, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(26, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(27, 1, 'Wood tray', 1, 20.00, '../../../../assets/img/Automation/Image/33.jpg'),
(28, 1, 'Candle pinwheel', 1, 90.00, '../../../../assets/img/Automation/Image/30.jpg'),
(29, 1, 'Candle Tray', 6, 80.00, '../../../../assets/img/Automation/Image/25.jpg'),
(30, 1, 'Lumos Honeydrew And Coconut', 1, 480.00, '../../../../assets/img/Automation/Image/13.jpg'),
(31, 1, 'Lumos Honeydrew And Coconut', 1, 480.00, '../../../../assets/img/Automation/Image/13.jpg'),
(32, 1, 'Lumos Honeydrew And Coconut', 1, 480.00, '../../../../assets/img/Automation/Image/13.jpg'),
(33, 12, 'Candle holder', 7, 90.00, '../../../../assets/img/Automation/Image/32.jpg'),
(34, 12, '3 Day WKND', 1, 300.00, '../../../../assets/img/Automation/Image/1.jpg'),
(35, 12, 'Day Party', 1, 150.00, '../../../../assets/img/Automation/Image/4.jpg'),
(36, 12, 'Amber And Vanilla', 1, 400.00, '../../../../assets/img/Automation/Image/2.jpg'),
(37, 12, '3 Day WKND', 1, 300.00, '../../../../assets/img/Automation/Image/1.jpg'),
(38, 1, 'Amber And Vanilla', 1, 400.00, '../../../../assets/img/Automation/Image/2.jpg'),
(39, 1, 'Wood tray', 1, 20.00, '../../../../assets/img/Automation/Image/33.jpg'),
(40, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(41, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(42, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `personal_shopping_bag`
--
ALTER TABLE `personal_shopping_bag`
  ADD PRIMARY KEY (`bag_item_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `personal_shopping_bag`
--
ALTER TABLE `personal_shopping_bag`
  MODIFY `bag_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `personal_shopping_bag`
--
ALTER TABLE `personal_shopping_bag`
  ADD CONSTRAINT `personal_shopping_bag_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
