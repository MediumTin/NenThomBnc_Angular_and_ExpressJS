-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 20, 2026 at 12:18 AM
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
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `email`, `address`, `created_at`, `username`, `password`, `first_name`, `last_name`) VALUES
(1, 'nguyentrungtin1002@gmail.com', 'Hanoi', '2025-11-06 18:22:42', 'nguyentrungtin2001@gmail.com', '09004092001', 'Nguyen Trung', 'Tin'),
(2, 'nguyentrunghieu0102@gmail.com', 'Ho Chi Minh', '2025-11-06 18:22:42', 'nguyentrunghieu2010@gmail.com', '09019012010', 'Nguyen Trung', 'Hieu'),
(3, 'tranbichngoc22112001@gmail.com', 'Phu Yen', '2025-11-06 18:22:42', 'tranbichngoc2001@gmail.com', '09022112001', 'Tran Bich', 'Ngoc'),
(4, 'maithianhnguyet22111977@gmail.com', 'Can Tho', '2025-11-06 18:22:42', 'maithianhnguyet1977@gmail.com', '09022111977', 'Mai Thi Anh', 'Nguyet'),
(5, 'nguyenvantu1975@gmail.com', 'Hue', '2025-11-06 18:22:42', 'nguyenvantu1975@gmail.com', '', 'Nguyen Van', 'Tu'),
(6, 'nguyenvanminh2001@gmail.com', '558/1/16 Binh Quoi Street', '2024-01-05 03:15:00', 'nguyenvanminh2001@gmail.com', '09004092001', 'Nguyen Van', 'Minh'),
(7, 'nguyenvantoan2001@gmail.com', 'Binh Thanh', '2024-01-05 03:15:00', 'nguyenvantoan2001@gmail.com', '09004092001', 'Nguyen Van', 'Toan'),
(8, 'nguyenvanlan2001@gmail.com', 'Binh Thanh', '2026-03-19 16:50:20', 'nguyenvanlan2001@gmail.com', '09004092001', 'Nguyen Van', 'Lan'),
(9, 'tranminhtoan2001@gmail.com', 'Binh Thanh', '2026-03-19 16:50:28', 'tranminhtoan2001@gmail.com', '09004092001', 'Tran Minh', 'Toan'),
(10, 'tranminhphong2001@gmail.com', 'Binh Thanh', '2026-03-19 16:50:36', 'tranminhphong2001@gmail.com', '09004092001', 'Tran Minh', 'Phong');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
