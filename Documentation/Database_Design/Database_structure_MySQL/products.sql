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
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_description` text DEFAULT NULL,
  `price_unit` decimal(10,2) NOT NULL,
  `product_category` varchar(100) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `price_unit`, `product_category`, `product_image`, `created_at`) VALUES
(1, '3 Day WKND', '3 Day WKND', 300.00, 'candle', '../../../../assets/img/Automation/Image/1.jpg', '2026-03-19 16:25:10'),
(2, 'Amber And Vanilla', 'Amber And Vanilla', 400.00, 'candle', '../../../../assets/img/Automation/Image/2.jpg', '2026-03-19 16:25:10'),
(3, 'Coconut And Sea Salt', 'Coconut And Sea Salt', 250.00, 'candle', '../../../../assets/img/Automation/Image/3.jpg', '2026-03-19 16:25:10'),
(4, 'Day Party', 'Day Party', 150.00, 'candle', '../../../../assets/img/Automation/Image/4.jpg', '2026-03-19 16:25:10'),
(5, 'Jasmin ylang ylang sandalwood', 'Jasmin ylang ylang sandalwood', 275.00, 'candle', '../../../../assets/img/Automation/Image/5.jpg', '2026-03-19 16:25:10'),
(6, 'Lavander Vanilia', 'Lavander Vanilia', 195.00, 'candle', '../../../../assets/img/Automation/Image/6.jpg', '2026-03-19 16:25:10'),
(7, 'Milk Vanilla', 'Milk Vanilla', 150.00, 'candle', '../../../../assets/img/Automation/Image/7.jpg', '2026-03-19 16:25:10'),
(8, 'Sandalwood And Rose', 'Sandalwood And Rose', 250.00, 'candle', '../../../../assets/img/Automation/Image/8.jpg', '2026-03-19 16:25:10'),
(9, 'Shower Playlist', 'Shower Playlist', 240.00, 'candle', '../../../../assets/img/Automation/Image/9.jpg', '2026-03-19 16:25:10'),
(10, 'Smells Like Cacao And Vanilla', 'Smells Like Cacao And Vanilla', 190.00, 'candle', '../../../../assets/img/Automation/Image/10.jpg', '2026-03-19 16:25:10'),
(11, 'Sunset Disco', 'Sunset Disco', 150.00, 'candle', '../../../../assets/img/Automation/Image/11.jpg', '2026-03-19 16:25:10'),
(12, 'Warn Cider And Cinamon', 'Warn Cider And Cinamon', 450.00, 'candle', '../../../../assets/img/Automation/Image/12.jpg', '2026-03-19 16:25:10'),
(13, 'Lumos Honeydrew And Coconut', 'Lumos Honeydrew And Coconut', 480.00, 'oil', '../../../../assets/img/Automation/Image/13.jpg', '2026-03-19 16:25:10'),
(14, 'Lumos Tropical Orchard', 'Lumos Tropical Orchard', 480.00, 'oil', '../../../../assets/img/Automation/Image/14.jpg', '2026-03-19 16:25:10'),
(15, 'Lumos Rose Boutique', 'Lumos Rose Boutique', 480.00, 'oil', '../../../../assets/img/Automation/Image/15.jpg', '2026-03-19 16:25:10'),
(16, 'Lumos Lemongrass', 'Lumos Lemongrass', 255.00, 'oil', '../../../../assets/img/Automation/Image/16.jpg', '2026-03-19 16:25:10'),
(17, 'Lumos Cajeput', 'Lumos Cajeput', 255.00, 'oil', '../../../../assets/img/Automation/Image/17.jpg', '2026-03-19 16:25:10'),
(18, 'Lumos menthol', 'Lumos menthol', 255.00, 'oil', '../../../../assets/img/Automation/Image/18.jpg', '2026-03-19 16:25:10'),
(19, 'Lumos cold', 'Lumos cold', 255.00, 'oil', '../../../../assets/img/Automation/Image/19.jpg', '2026-03-19 16:25:10'),
(20, 'Lumos And Cucumber', 'Lumos And Cucumber', 450.00, 'oil', '../../../../assets/img/Automation/Image/20.jpg', '2026-03-19 16:25:10'),
(21, 'Lumos Juicy Peach', 'Lumos Juicy Peach', 450.00, 'oil', '../../../../assets/img/Automation/Image/21.jpg', '2026-03-19 16:25:10'),
(22, 'Lumos Midnight sandalwood', 'Lumos Midnight sandalwood', 600.00, 'oil', '../../../../assets/img/Automation/Image/22.jpg', '2026-03-19 16:25:10'),
(23, 'YOU ARE THE MAGIC', 'YOU ARE THE MAGIC', 295.00, 'candle', '../../../../assets/img/Automation/Image/23.jpg', '2026-03-19 16:25:10'),
(24, 'BLOW A WISH', 'BLOW A WISH', 315.00, 'candle', '../../../../assets/img/Automation/Image/24.jpg', '2026-03-19 16:25:10'),
(25, 'Candle Tray', 'Candle Tray', 80.00, 'accessory', '../../../../assets/img/Automation/Image/25.jpg', '2026-03-19 16:25:10'),
(26, 'Candle Snuffer', 'Candle Snuffer', 85.00, 'accessory', '../../../../assets/img/Automation/Image/26.jpg', '2026-03-19 16:25:10'),
(27, 'Candle Scissor', 'Candle Scissor', 80.00, 'accessory', '../../../../assets/img/Automation/Image/27.jpg', '2026-03-19 16:25:10'),
(28, 'Candle matchbox', 'Candle matchbox', 10.00, 'accessory', '../../../../assets/img/Automation/Image/28.jpg', '2026-03-19 16:25:10'),
(29, 'Candle rotation tray', 'Candle rotation tray', 89.00, 'accessory', '../../../../assets/img/Automation/Image/29.jpg', '2026-03-19 16:25:10'),
(30, 'Candle pinwheel', 'Candle pinwheel', 90.00, 'accessory', '../../../../assets/img/Automation/Image/30.jpg', '2026-03-19 16:25:10'),
(31, 'Candle metal tray', 'Candle metal tray', 150.00, 'accessory', '../../../../assets/img/Automation/Image/31.jpg', '2026-03-19 16:25:10'),
(32, 'Candle holder', 'Candle holder', 90.00, 'accessory', '../../../../assets/img/Automation/Image/32.jpg', '2026-03-19 16:25:10'),
(33, 'Wood tray', 'Wood tray', 20.00, 'accessory', '../../../../assets/img/Automation/Image/33.jpg', '2026-03-19 16:25:10'),
(34, 'Nen_and_Hoa', 'Nen_and_Hoa', 600.00, 'candle', '../../../../assets/img/Automation/Image/39.jpg', '2026-03-19 16:25:10'),
(35, 'Dalat Gift', 'Dalat Gift', 600.00, 'gift', '../../../../assets/img/Automation/Image/40.jpg', '2026-03-19 16:25:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
